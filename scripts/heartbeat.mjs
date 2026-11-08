import { readFile, writeFile, appendFile } from 'node:fs/promises';

const timezone = 'Africa/Nairobi';
const counterUrl = new URL('../data/counter.json', import.meta.url);
const historyUrl = new URL('../data/history.json', import.meta.url);
const now = new Date();

function zonedParts(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

const p = zonedParts(now);
const dateKey = `${p.year}-${p.month}-${p.day}`;
const localTimestamp = `${dateKey}T${p.hour}:${p.minute}:${p.second}+03:00`;
const hour = Number(p.hour);
const requested = (process.env.MILESTONE || 'auto').toLowerCase();
const milestone = ['morning', 'afternoon', 'evening'].includes(requested)
  ? requested
  : hour >= 4 && hour < 11 ? 'morning' : hour >= 11 && hour < 17 ? 'afternoon' : 'evening';

const definitions = {
  morning: { greeting: 'Good morning', emoji: '🌅', label: 'Morning' },
  afternoon: { greeting: 'Good afternoon', emoji: '☀️', label: 'Afternoon' },
  evening: { greeting: 'Good evening', emoji: '🌙', label: 'Evening' },
};
const selected = definitions[milestone];
const [counterRaw, historyRaw] = await Promise.all([
  readFile(counterUrl, 'utf8'),
  readFile(historyUrl, 'utf8'),
]);
const counter = JSON.parse(counterRaw);
const history = JSON.parse(historyRaw);
let day = history.days.find((entry) => entry.date === dateKey);
if (!day) {
  day = { date: dateKey, milestones: {} };
  history.days.push(day);
}

if (day.milestones[milestone]) {
  console.log(`Heartbeat already recorded: ${dateKey} / ${milestone}. No duplicate commit.`);
  process.exit(0);
}

day.milestones[milestone] = {
  completedAt: localTimestamp,
  label: selected.greeting,
};
history.days.sort((a, b) => a.date.localeCompare(b.date));

const completedDays = history.days
  .filter((entry) => Object.keys(entry.milestones || {}).length > 0)
  .map((entry) => entry.date);
const completedMilestones = history.days.flatMap((entry) => Object.keys(entry.milestones || {}));
const streaks = [];
let run = 0;
let previous = null;
for (const date of completedDays) {
  const current = new Date(`${date}T00:00:00Z`);
  const prior = previous ? new Date(`${previous}T00:00:00Z`) : null;
  if (prior && (current - prior) / 86400000 === 1) run += 1;
  else { if (run) streaks.push(run); run = 1; }
  previous = date;
}
if (run) streaks.push(run);

const today = new Date(`${dateKey}T00:00:00Z`);
const yesterday = new Date(today);
yesterday.setUTCDate(yesterday.getUTCDate() - 1);
const todayString = today.toISOString().slice(0, 10);
const yesterdayString = yesterday.toISOString().slice(0, 10);
let currentStreak = 0;
if (completedDays.includes(todayString) || completedDays.includes(yesterdayString)) {
  let cursor = completedDays.includes(todayString) ? today : yesterday;
  const set = new Set(completedDays);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    currentStreak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
}

counter.timezone = timezone;
counter.totalMilestones = completedMilestones.length;
counter.totalDays = completedDays.length;
counter.currentStreak = currentStreak;
counter.longestStreak = Math.max(0, ...streaks);
counter.lastSuccessfulDate = dateKey;
counter.lastSuccessfulAt = localTimestamp;
counter.lastMilestone = milestone;
counter.milestoneCounts = {
  morning: completedMilestones.filter((key) => key === 'morning').length,
  afternoon: completedMilestones.filter((key) => key === 'afternoon').length,
  evening: completedMilestones.filter((key) => key === 'evening').length,
};

await Promise.all([
  writeFile(counterUrl, JSON.stringify(counter, null, 2) + '\n'),
  writeFile(historyUrl, JSON.stringify(history, null, 2) + '\n'),
]);
await import('./update-readme.mjs');

const output = process.env.GITHUB_OUTPUT;
const commitMessage = `${selected.greeting} ${selected.emoji} — ${dateKey} (EAT)`;
if (output) await appendFile(output, `commit_message=${commitMessage}\n`);
console.log(`${commitMessage} recorded at ${localTimestamp}`);
console.log(`Active days: ${counter.totalDays}; streak: ${counter.currentStreak}; total heartbeats: ${counter.totalMilestones}`);
