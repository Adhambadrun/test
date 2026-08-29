# BREAK — Sales Floor Break Manager

**Neo-Apple Liquid Glass edition** · built from `BREAK-master-build-prompt.md` + `Design.html` (the repo's master prompt and shader background).

A premium break punch-in/punch-out web app for a night-shift sales team (10 PM – 6 AM, Egypt time). Four roles, four teams, real-time pod grid, SNN live ticker, warnings, WC tracking, bonus breaks, God Mode.

> ⚠️ **Preview build.** Real Firebase Auth/Firestore/Storage keys aren't in this repo, so the app runs on a **simulated real-time store** (client-side state, 1s heartbeat, auto-ends, capacity limits, WC caps — all the Part 15 logic is enforced). Swapping in real Firebase is a drop-in: see `src/store.jsx` (every action is a clean mutation point) and Parts 5 / 20 / 26 of the master prompt. The login page ships the exact "Sign in with Google" button and a clearly-labeled **Demo Access** role picker.

## Run it

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # production build
node scripts/smoke.mjs   # jsdom smoke test: mounts app, walks every route × role, checks guards
```

## Demo accounts (login screen)

| Role | Identity | Sees |
|---|---|---|
| Agent | Solomon (Team A) | Own breaks only + teammates' name/status (privacy enforced) |
| Supervisor | Omar Hassan (Team A) | Team A only — admin radial menus, side panel, handover notes |
| Admin | Karim El-Sayed | All teams — stats, live table, charts, team selector, broadcasts |
| Developer | Adham Badran | Everything — God Mode, live logs, rally mode, feature toggles, audit log, role switcher |

## Screens

- **`/login`** — shader background, glass card, Google button, demo access
- **`/dashboard`** — header (shift clock, capacity, total break time) + SNN ticker + pod grid + goal bar
- **`/supervisor`** — team stats, live on-break rail, wellness, late/early tracker, handover editor
- **`/admin`** — 5 stat cards, breaks-over-time chart, live agents table (sortable), top break takers podium, insights
- **`/developer`** — God Mode: system overview, terminal logs, quick actions, feature toggles, rally mode, audit log
- **`/settings`** — General / Break Rules / Warning Levels / Sound & Alerts / UI Customization / Integrations
- **`/messages`** — hierarchy-based contacts, read receipts, typing indicators, auto-replies
- **`/profile`** — identity card, motto/emoji, stats, goal tracker, change-picture picker
- **`/unauthorized`** — role guard screen

## What's implemented from the master prompt

- **Part 6 (Visual System)** — five glass materials (ultra-thin → ultra-thick) with specular highlights + ambient shadows, concentric radii, signal-color-as-light rule, Orbitron/Teko/Inter/JetBrains Mono type, SNAP/GLIDE/AMBIENT_LOOP motion presets, coin-flip exception, reduced-motion/transparency fallbacks.
- **Design.html shader** — ported verbatim (`src/shader/BackgroundShader.jsx`): drifting obsidian smoke, crimson/cyan light leaks, gold embers.
- **Parts 7–11** — pixel-spec header, SNN ticker + news panel (privacy-aware headlines), circular pods (progress ring, 3D coin-flip timer, slot dots, break-type chip, YOU/warning/bonus/birthday badges), 5-button hover radial menu with staggered SNAP entrance + confirm modal, 8-button admin radial menu.
- **Parts 12–15** — warning levels L1–L3 with penalties + funny tone, WC 20-min daily tracking with progress, capacity 5/team, 60-min budget, 5 slots, 15-min auto-end, restricted hours, bonus breaks (10 BQ leads rule), blocked agents.
- **Parts 16–18** — agent detail side panel (session grid, WC tracking, monthly overview, actions, timeline), admin dashboard, God Mode command deck, settings panel tabs.
- **Part 23** — animation map: pod stagger, radial menu springs, coin flip, ring GLIDE fill, heartbeat at 13m, toasts with linear drain bar, modal scale-up, marquee.
- **Part 29 (RBAC)** — route matrix enforced in `src/App.jsx` (`Guard`); smoke test asserts every role × route combination.

## Project structure

```
break-app/
├── index.html · vite.config.js · tailwind.config.js · postcss.config.js
├── scripts/smoke.mjs              # jsdom role×route smoke test
└── src/
    ├── index.css                  # liquid-glass tokens, materials, keyframes
    ├── store.jsx                  # simulated real-time store + break logic
    ├── App.jsx                    # routes + role guards + global overlays
    ├── shader/BackgroundShader.jsx# Design.html shader (verbatim)
    ├── data/seed.js               # 4 teams, 32 agents, headlines, messages
    ├── lib/time.js                # Cairo time, shift phase, restricted hours
    ├── components/                # Header, Ticker, Pod, SidePanel, GlobalActions,
    │                              #   GlassPanel, Modal, Toasts, Avatar, Charts, TeamLogo
    └── screens/                   # Login, Dashboard, Supervisor, Admin, Developer,
                                   #   Settings, Messages, Profile, Unauthorized
```
