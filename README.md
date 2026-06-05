# Slurp — Hydration Tracker (Non-Gamified)

A Progressive Web App (PWA) for tracking daily water intake, built as part of an MCAST DGD research study on how gamification affects hydration habits.

This branch is the **non-gamified control version**. For the version with pets, XP, and challenges, see the [`main`](../../tree/main) branch.

---

## Features

- **Hydration ring** — a visual progress ring that fills as you log water and decays over time, reflecting that your body uses water continuously throughout the day
- **Water logger** — quickly log water intake in preset amounts
- **Customisable daily goal** — adjust your target (default: 2,000 ml)
- **Dark / light theme** — toggle between themes
- **Help & FAQ** — in-app guidance and installation instructions
- **PWA installable** — install to your home screen on iOS (Safari) or Android (Chrome) for a native-app experience
- **Fully anonymous** — participants are identified by an auto-generated username only; no personal data is collected

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 19 + Vite |
| Backend / DB | Supabase (PostgreSQL) |
| Hosting | Vercel |
| PWA | Custom service worker |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project with the required tables (`users`, `water_logs`)

### Installation

```bash
cd gamified-habit-tracker
npm install
```

### Environment variables

Create a `.env.local` file inside `gamified-habit-tracker/`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

---

## Project Structure

```
gamified-habit-tracker/
├── public/
│   └── sw.js          # Service worker
└── src/
    ├── components/
    │   ├── layout/     # Bottom navigation bar
    │   ├── ui/         # Welcome modal
    │   └── water/      # Hydration ring, logger, goal setter
    ├── hooks/          # Custom React hooks
    ├── pages/          # Help & FAQ page
    └── lib/            # Supabase client
```

---

## Research Context

This app is one of two versions used in a study comparing gamified and non-gamified habit-tracking interfaces. Participants are randomly assigned to either this control version or the gamified version. All data collected is anonymised and used solely for academic research purposes.