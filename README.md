# World Clock

A personal world clock and GitHub activity companion, built around **Africa/Nairobi (EAT, UTC+03:00)**.

> The clock is live in the browser. The daily heartbeat is recorded by GitHub Actions at 06:00, 12:00 and 18:00 Nairobi time.

## Features

- Live Nairobi clock with a contextual greeting.
- Multi-city world clock with seconds and local dates.
- Daily activity calendar with morning, afternoon and evening milestones.
- Streak, total-day and heartbeat statistics.
- GitHub Actions heartbeat workflow and generated README status.
- No external database or paid API required.

## Daily schedule

| Nairobi time | UTC | Milestone | Commit message |
|---|---:|---|---|
| 06:07 | 03:07 | Morning | Good morning 🌅 |
| 12:07 | 09:07 | Afternoon | Good afternoon ☀️ |
| 18:07 | 15:07 | Evening | Good evening 🌙 |

The scheduler uses GitHub Actions' IANA timezone support with `Africa/Nairobi`, so the schedule remains anchored to Nairobi time. The application and heartbeat script use the same timezone for all date and period calculations.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Live status

<!-- DAYCOUNT:START -->
## Live DayCount status

| Metric | Current value |
|---|---:|
| Active contribution days | **4** |
| Current consecutive-day streak | **4 days** |
| Longest streak | **4 days** |
| Total successful heartbeats | **6** |
| Last successful heartbeat | 11 Nov 2026, 00:15 EAT |

### Today's Nairobi milestones — 2026-11-11

| Moment | Scheduled time | Status |
|---|---:|---|
| 🌅 Morning | 06:00 EAT | ◻️ Pending |
| ☀️ Afternoon | 12:00 EAT | ◻️ Pending |
| 🌙 Evening | 18:00 EAT | ✅ Completed |

**Today:** 1/3 milestones completed · **Timezone:** Africa/Nairobi (EAT, UTC+3)

<!-- DAYCOUNT:END -->

## GitHub Actions

The workflow runs at 06:07, 12:07 and 18:07 Africa/Nairobi time, and can also be started manually from the Actions tab. The seven-minute offset avoids scheduling exactly on the hour, when GitHub reports higher workflow queue load. It updates `data/counter.json`, `data/history.json` and this README, then commits using the scheduled workflow actor's GitHub noreply email. Keep your GitHub account as the actor that last edits the workflow schedule, and ensure its noreply address is enabled.

## Deployment

The frontend is a static Vite application and can be deployed to Cloudflare Pages with:

- Build command: `npm run build`
- Build output directory: `dist`

## Project status

The dashboard clock is independent of the scheduled GitHub workflow. GitHub Actions updates the persistent activity record at each scheduled milestone; it does not keep a browser clock running.

---

Made with care in Nairobi, Kenya. 🇰🇪
