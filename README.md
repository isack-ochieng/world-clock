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
| 06:00 | 03:00 | Morning | Good morning 🌅 |
| 12:00 | 09:00 | Afternoon | Good afternoon ☀️ |
| 18:00 | 15:00 | Evening | Good evening 🌙 |

The scheduler uses UTC cron because GitHub Actions scheduled workflows run in UTC. The application and heartbeat script use the IANA timezone `Africa/Nairobi` for all date and period calculations.

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

## GitHub Actions

The workflow runs three times daily and can also be started manually from the Actions tab. It updates `data/counter.json`, `data/history.json` and this README, then commits the changes using the repository's GitHub Actions identity.

For contribution graph attribution, configure `GITHUB_COMMIT_EMAIL` as a repository Actions variable with an email verified on the GitHub account. If unset, the workflow uses GitHub's standard Actions bot identity, which will not attribute commits to a personal account.

## Deployment

The frontend is a static Vite application and can be deployed to Cloudflare Pages with:

- Build command: `npm run build`
- Build output directory: `dist`

## Project status

The dashboard clock is independent of the scheduled GitHub workflow. GitHub Actions updates the persistent activity record at each scheduled milestone; it does not keep a browser clock running.

---

Made with care in Nairobi, Kenya. 🇰🇪
