export const HOME_TIME_ZONE = 'Africa/Nairobi';

export const CITIES = [
  { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', code: 'EAT', flag: '🇰🇪', home: true },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London', code: 'GMT/BST', flag: '🇬🇧' },
  { city: 'New York', country: 'United States', timezone: 'America/New_York', code: 'ET', flag: '🇺🇸' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', code: 'JST', flag: '🇯🇵' },
  { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai', code: 'GST', flag: '🇦🇪' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', code: 'SAST', flag: '🇿🇦' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', code: 'SGT', flag: '🇸🇬' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', code: 'AET', flag: '🇦🇺' },
  { city: 'Los Angeles', country: 'United States', timezone: 'America/Los_Angeles', code: 'PT', flag: '🇺🇸' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto', code: 'ET', flag: '🇨🇦' },
] as const;

export type MilestoneKey = 'morning' | 'afternoon' | 'evening';

export const MILESTONES: { key: MilestoneKey; label: string; greeting: string; emoji: string; hour: number; time: string }[] = [
  { key: 'morning', label: 'Morning', greeting: 'Good morning', emoji: '🌅', hour: 6, time: '06:00' },
  { key: 'afternoon', label: 'Afternoon', greeting: 'Good afternoon', emoji: '☀️', hour: 12, time: '12:00' },
  { key: 'evening', label: 'Evening', greeting: 'Good evening', emoji: '🌙', hour: 18, time: '18:00' },
];

export function getZonedParts(date: Date, timeZone = HOME_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value])) as Record<string, string>;
}

export function getGreeting(date: Date) {
  const hour = Number(getZonedParts(date).hour);
  if (hour >= 5 && hour < 12) return { text: 'Good morning', emoji: '🌅', note: 'A new day is yours to build.' };
  if (hour >= 12 && hour < 17) return { text: 'Good afternoon', emoji: '☀️', note: 'Keep the momentum going.' };
  if (hour >= 17 && hour < 21) return { text: 'Good evening', emoji: '🌙', note: 'Another day, well counted.' };
  return { text: 'Working late?', emoji: '✦', note: 'The world keeps turning. So do you.' };
}

export function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(date);
}

export function formatDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
}

export function getNairobiDateKey(date: Date) {
  const p = getZonedParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}
