import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, CalendarDays, Check, Clock3, Code2, Github,
  Globe2, HeartPulse, MapPin, Moon, RefreshCw, Sun, Timer, TrendingUp,
} from 'lucide-react';
import counter from '../data/counter.json';
import history from '../data/history.json';
import { CITIES, formatDate, formatTime, getGreeting, getNairobiDateKey, MILESTONES } from './lib/clock';

type DayRecord = {
  date: string;
  milestones: Partial<Record<'morning' | 'afternoon' | 'evening', { completedAt: string; label: string }>>;
};

const days = (history.days ?? []) as DayRecord[];
const dayMap = new Map(days.map((day) => [day.date, day]));

function ClockCard({ city, now }: { city: (typeof CITIES)[number]; now: Date }) {
  return (
    <article className={`world-clock-card ${'home' in city && city.home ? 'home-clock' : ''}`}>
      <div className="clock-card-top">
        <span className="city-flag">{city.flag}</span>
        <span className="timezone-code">{city.code}</span>
      </div>
      <div className="city-name">{city.city}</div>
      <div className="city-country">{city.country}</div>
      <div className="city-time">{formatTime(now, city.timezone)}</div>
      <div className="city-date">{formatDate(now, city.timezone)}</div>
      {'home' in city && city.home && <span className="home-tag"><MapPin size={11} /> YOUR HOME TIME</span>}
    </article>
  );
}

function ActivityCalendar({ now }: { now: Date }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const view = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - firstDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return day;
  });
  const todayKey = getNairobiDateKey(now);
  const monthName = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(view);

  return (
    <section className="panel calendar-panel">
      <div className="section-heading">
        <div><span className="eyebrow">YOUR CONSISTENCY</span><h2>Activity calendar</h2></div>
        <div className="calendar-controls">
          <button aria-label="Previous month" onClick={() => setMonthOffset((value) => value - 1)}>‹</button>
          <span>{monthName}</span>
          <button aria-label="Next month" onClick={() => setMonthOffset((value) => Math.min(0, value + 1))} disabled={monthOffset >= 0}>›</button>
        </div>
      </div>
      <div className="calendar-grid calendar-weekdays">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span key={label}>{label}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {cells.map((day, index) => {
          if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = dayMap.get(key);
          const completed = MILESTONES.filter((milestone) => record?.milestones?.[milestone.key]).length;
          return (
            <div key={key} className={`calendar-day ${key === todayKey ? 'today' : ''} ${completed ? 'has-activity' : ''}`}>
              <span>{day}</span>
              <div className="day-dots">
                {MILESTONES.map((milestone) => <i key={milestone.key} className={record?.milestones?.[milestone.key] ? 'done' : ''} />)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span><i className="legend-dot done" /> Completed</span>
        <span><i className="legend-dot" /> Pending</span>
        <span className="legend-note">Three daily milestones</span>
      </div>
    </section>
  );
}

function App() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = getGreeting(now);
  const todayKey = getNairobiDateKey(now);
  const today = dayMap.get(todayKey);
  const completedToday = MILESTONES.filter((milestone) => today?.milestones?.[milestone.key]);
  const upcoming = MILESTONES.find((milestone) => !today?.milestones?.[milestone.key]);
  const lastUpdated = counter.lastSuccessfulAt
    ? new Date(counter.lastSuccessfulAt).toLocaleString('en-GB', { timeZone: 'Africa/Nairobi', dateStyle: 'medium', timeStyle: 'short' }) + ' EAT'
    : 'Waiting for first heartbeat';

  const recentDays = useMemo(() => [...days].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5), []);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="World Clock home">
          <span className="brand-mark"><Globe2 size={21} /></span>
          <span>world<span className="brand-light">clock</span><small>BY DAYCOUNT</small></span>
        </a>
        <div className="topbar-right">
          <span className="live-indicator"><i /> LIVE CLOCK</span>
          <a className="github-link" href="https://github.com/isack-ochieng/world-clock" target="_blank" rel="noreferrer"><Github size={16} /> Repository <ArrowUpRight size={13} /></a>
        </div>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="location-label"><MapPin size={13} /> NAIROBI, KENYA <span>·</span> EAT (UTC+3)</div>
          <div className="greeting-line"><span>{greeting.emoji}</span><h1>{greeting.text}.</h1></div>
          <p className="hero-subtitle">{greeting.note}</p>
          <div className="hero-clock-wrap">
            <div className="hero-clock">{formatTime(now, 'Africa/Nairobi')}</div>
            <span className="clock-zone">EAT</span>
          </div>
          <div className="hero-date">{new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Nairobi', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now)}</div>
          <div className="hero-rule"><span /></div>
          <div className="next-milestone">
            <span className="next-icon"><Timer size={16} /></span>
            <span>{upcoming ? <>Next heartbeat <strong>{upcoming.time} · {upcoming.label}</strong></> : <>All milestones completed <strong>See you tomorrow.</strong></>}</span>
          </div>
        </div>

        <div className="hero-side">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core"><Globe2 size={48} strokeWidth={1.1} /></div>
          <div className="orbit-caption"><span className="orbit-dot" /> ONE WORLD. EVERY SECOND.</div>
          <div className="hero-side-bottom"><span>TIME STANDARD</span><strong>Africa/Nairobi</strong><span>FIXED HOME TIMEZONE</span></div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card"><div className="stat-icon"><CalendarDays size={17} /></div><span className="stat-label">ACTIVE DAYS</span><strong>{counter.totalDays}</strong><small>Days with a heartbeat</small></article>
        <article className="stat-card"><div className="stat-icon"><TrendingUp size={17} /></div><span className="stat-label">CURRENT STREAK</span><strong>{counter.currentStreak}<small className="unit"> days</small></strong><small>Consecutive calendar days</small></article>
        <article className="stat-card"><div className="stat-icon"><HeartPulse size={17} /></div><span className="stat-label">TOTAL HEARTBEATS</span><strong>{counter.totalMilestones}</strong><small>Morning · Afternoon · Evening</small></article>
        <article className="stat-card"><div className="stat-icon"><RefreshCw size={17} /></div><span className="stat-label">LONGEST STREAK</span><strong>{counter.longestStreak}<small className="unit"> days</small></strong><small>Personal best</small></article>
      </section>

      <section className="content-grid">
        <div className="main-column">
          <section className="panel world-panel">
            <div className="section-heading">
              <div><span className="eyebrow">SAME MOMENT, DIFFERENT PLACES</span><h2>World clocks <span className="heading-count">10 LOCATIONS</span></h2></div>
              <span className="seconds-badge"><span /> UPDATING EVERY SECOND</span>
            </div>
            <div className="world-clock-grid">{CITIES.map((city) => <ClockCard key={city.timezone} city={city} now={now} />)}</div>
          </section>

          <ActivityCalendar now={now} />

          <section className="panel milestone-panel">
            <div className="section-heading">
              <div><span className="eyebrow">THREE MOMENTS, EVERY DAY</span><h2>Today's milestones</h2></div>
              <span className="date-chip">{todayKey}</span>
            </div>
            <div className="milestone-list">
              {MILESTONES.map((milestone, index) => {
                const done = Boolean(today?.milestones?.[milestone.key]);
                return <div className={`milestone-row ${done ? 'is-complete' : ''}`} key={milestone.key}>
                  <div className="milestone-symbol">{done ? <Check size={17} /> : <span>{milestone.emoji}</span>}</div>
                  <div className="milestone-info"><strong>{milestone.greeting}</strong><small>{milestone.time} EAT · {milestone.label} heartbeat</small></div>
                  <span className={`milestone-status ${done ? 'complete' : ''}`}>{done ? 'COMPLETED' : 'PENDING'}</span>
                </div>;
              })}
            </div>
            <div className="milestone-foot"><span>{completedToday.length} of 3 completed today</span><div className="progress-track"><i style={{ width: `${completedToday.length / 3 * 100}%` }} /></div></div>
          </section>
        </div>

        <aside className="side-column">
          <section className="panel heartbeat-panel">
            <div className="side-panel-title"><span className="eyebrow">AUTOMATION STATUS</span><span className="status-pulse"><i /> TRACKING</span></div>
            <div className="heartbeat-graphic"><div className="pulse-ring"><HeartPulse size={31} /></div></div>
            <h3>Time keeps moving.</h3>
            <p>Your daily heartbeat is scheduled by GitHub Actions. The dashboard clock runs independently.</p>
            <div className="last-heartbeat"><span>LAST SUCCESSFUL HEARTBEAT</span><strong>{lastUpdated}</strong></div>
            <a className="workflow-link" href="https://github.com/isack-ochieng/world-clock/actions" target="_blank" rel="noreferrer">View workflow runs <ArrowUpRight size={14} /></a>
          </section>

          <section className="panel recent-panel">
            <div className="section-heading compact"><div><span className="eyebrow">THE PAPER TRAIL</span><h2>Recent activity</h2></div><Code2 size={18} /></div>
            {recentDays.length ? <div className="recent-list">{recentDays.map((day) => {
              const count = MILESTONES.filter((milestone) => day.milestones?.[milestone.key]).length;
              return <div className="recent-row" key={day.date}><span className="recent-check"><Check size={13} /></span><span className="recent-date"><strong>{day.date}</strong><small>{count} / 3 milestones</small></span><span className="recent-count">{count}×</span></div>;
            })}</div> : <div className="empty-state"><Clock3 size={20} /><span>Your first heartbeat will appear here.</span></div>}
          </section>

          <section className="quote-panel">
            <Sun size={18} />
            <p>“Great things are done by a series of small things brought together.”</p>
            <span>— VINCENT VAN GOGH</span>
          </section>
        </aside>
      </section>

      <footer className="footer">
        <div className="footer-brand"><Globe2 size={15} /> WORLDCLOCK <span>·</span> DAYCOUNT</div>
        <span>Built with precision in Nairobi, Kenya 🇰🇪</span>
        <a href="https://github.com/isack-ochieng/world-clock" target="_blank" rel="noreferrer">OPEN SOURCE <ArrowUpRight size={12} /></a>
      </footer>
    </main>
  );
}

export default App;
