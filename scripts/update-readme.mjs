import { readFile, writeFile } from 'node:fs/promises';

const readmePath = new URL('../README.md', import.meta.url);
const counterPath = new URL('../data/counter.json', import.meta.url);
const historyPath = new URL('../data/history.json', import.meta.url);
const [readme, counterRaw, historyRaw] = await Promise.all([
  readFile(readmePath, 'utf8'),
  readFile(counterPath, 'utf8'),
  readFile(historyPath, 'utf8'),
]);
const counter = JSON.parse(counterRaw);
const history = JSON.parse(historyRaw);
const last = counter.lastSuccessfulAt
  ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(counter.lastSuccessfulAt)) + ' EAT'
  : 'Awaiting first heartbeat';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const todayRecord = history.days.find((day) => day.date === today);
const completed = ['morning', 'afternoon', 'evening'].filter((key) => todayRecord?.milestones?.[key]);
const milestoneRows = [
  ['Morning', '06:00', '🌅', 'morning'],
  ['Afternoon', '12:00', '☀️', 'afternoon'],
  ['Evening', '18:00', '🌙', 'evening'],
].map(([label, time, emoji, key]) => {
  const done = Boolean(todayRecord?.milestones?.[key]);
  return `| ${emoji} ${label} | ${time} EAT | ${done ? '✅ Completed' : '◻️ Pending'} |`;
}).join('\n');

const block = `<!-- DAYCOUNT:START -->
## Live DayCount status

| Metric | Current value |
|---|---:|
| Active contribution days | **${counter.totalDays}** |
| Current consecutive-day streak | **${counter.currentStreak} days** |
| Longest streak | **${counter.longestStreak} days** |
| Total successful heartbeats | **${counter.totalMilestones}** |
| Last successful heartbeat | ${last} |

### Today's Nairobi milestones — ${today}

| Moment | Scheduled time | Status |
|---|---:|---|
${milestoneRows}

**Today:** ${completed.length}/3 milestones completed · **Timezone:** Africa/Nairobi (EAT, UTC+3)

<!-- DAYCOUNT:END -->`;

const start = '<!-- DAYCOUNT:START -->';
const end = '<!-- DAYCOUNT:END -->';
const startIndex = readme.indexOf(start);
const endIndex = readme.indexOf(end);
if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  throw new Error('README is missing the DayCount status markers.');
}
const updated = readme.slice(0, startIndex) + block + readme.slice(endIndex + end.length);
await writeFile(readmePath, updated);
console.log('README status refreshed.');
