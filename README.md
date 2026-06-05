# Slurp — Gamified Hydration Tracker

A Progressive Web App (PWA) for tracking daily water intake, built as part of an MCAST DGD research study on how gamification affects hydration habits.

This branch is the **gamified version**. For the control group (non-gamified), see the [`Non-Gamified`](../../tree/Non-Gamified) branch.

---

## Features

- **Hydration ring** — a visual progress ring that fills as you log water and decays over time, reflecting that your body uses water continuously throughout the day
- **Virtual pets** — a companion animal (cat, dog, bird, panda, or dinosaur) whose mood reflects your hydration level; pets are unlocked as you level up
- **XP & levels** — earn experience points for every log; level up to unlock new pets and features
- **Daily streaks** — consecutive days of hitting your goal reward streak badges
- **Challenges** — complete hydration goals to earn bonus XP
- **Leaderboard** — see how your hydration compares to other participants
- **Customisable daily goal** — adjust your target (default: 2,000 ml)
- **Dark / light theme** — toggle between themes
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
│   ├── pets/          # Pet sprite sheets (cat, dog, bird, panda, dinosaur)
│   ├── icons/         # Navigation & UI icons
│   ├── sounds/        # Water-log sound effect
│   └── sw.js          # Service worker
└── src/
    ├── components/
    │   ├── challenges/ # Challenge cards
    │   ├── layout/     # Bottom navigation bar
    │   ├── pet/        # Virtual pet & pet selector
    │   ├── ui/         # XP bar, streak badge, toasts, modals
    │   └── water/      # Hydration ring, logger, goal setter
    ├── hooks/          # Custom React hooks
    ├── pages/          # Challenges, Leaderboard, Help pages
    ├── utils/          # XP calculations, streak logic
    └── lib/            # Supabase client
```

---

## Research Context

This app is one of two versions used in a study comparing gamified and non-gamified habit-tracking interfaces. Participants are randomly assigned to either this version or the non-gamified control. All data collected is anonymised and used solely for academic research purposes.