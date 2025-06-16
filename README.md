# Player Development App

A **sport-agnostic**, voice-friendly web application for coaches and admins to manage players, development plans (PDPs) and observations – all powered by **Supabase** and **React**.

Old-gold themed (#CFB53B), responsive from mobile to desktop, and designed for **live data only** (no mock/seed).

---

## ✨  Features
| Area | Details |
|------|---------|
| Auth | Supabase Auth (email/password) with **Coach** & **Admin** roles |
| Dashboard | Top info cards – **Total Players**, **Observations This Week** |
| Player panel | List of athletes, active PDP summary, quick “Add Observation / Edit PDP” |
| Observation panel | Newest-first list, filterable |
| CRUD | Players, PDPs (single active at a time), Observations |
| PDP logic | New PDP auto-archives previous ones (`active=false`) |
| Voice dictation | Mic icon on text areas. Tooltip: “Tap the mic to dictate, or type manually.” |
| Activity log | All actions written to `activity_log` table for future analytics |
| Responsive | Works on any screen; mobile menu collapses automatically |
| Dark theme | Black, white & Old Gold palette with Material-UI custom theme |

---

## 🏗️  Tech Stack
* **React 18 / Vite** – lightning-fast dev server
* **Material-UI (MUI v5)** – component library & theming
* **Tailwind CSS** – utility helpers
* **Supabase** – Postgres, Auth, Storage
* **Date-Fns** – lightweight date formatting
* **Web Speech API** – native browser voice input

---

## ⚙️  Prerequisites
| Tool | Version |
|------|---------|
| Node.js | 18 LTS or newer |
| PNPM | 8.x (or npm / yarn) |
| Supabase | Existing project matching schema |
| Git | any recent |

---

## 🚀  Getting Started

### 1. Clone
```
git clone https://github.com/your-org/player-development-app.git
cd player-development-app
```

### 2. Install deps
```
pnpm install            # or: npm i / yarn
```

### 3. Environment Variables  
Copy example then fill in real values from **Supabase → Settings → API**.
```
cp .env.example .env
```
```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```
Optional:
```
# VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
# VITE_THEME_COLOR=#CFB53B
```

### 4. Dev server
```
pnpm dev
```
Runs at <http://localhost:5173> (hot-reload).

---

## 🗂️  Project Structure
```
├─ public/           # static assets, redirects, favicon
├─ src/
│  ├─ App.jsx        # root with Theme & Router
│  ├─ theme.js       # Old-Gold dark theme
│  ├─ lib/
│  │   └─ supabase.js        # client + generic services
│  ├─ components/
│  │   ├─ dashboard/         # TopSection, PlayerList, ...
│  │   ├─ common/VoiceInputField.jsx
│  │   ├─ auth/              # Login
│  │   ├─ players/
│  │   ├─ observations/
│  │   └─ pdps/
│  └─ index.css     # tailwind base
├─ vite.config.js
└─ README.md
```

---

## 📡  Deployment

### Vercel
1. **Import Project** from GitHub
2. Framework preset: **Vite**
3. Add environment variables (`VITE_SUPABASE_*`)
4. Click **Deploy**

### Netlify
```
Build command : pnpm build
Publish dir   : dist
```
Add env vars under **Site settings → Build & deploy → Environment**.

---

## 🎙️  Voice Dictation Guide
1. Click the **mic** icon in an Observation or PDP text area  
2. “Listening…” overlay appears – start speaking  
3. Your speech appends to the field in real-time  
4. Click the mic again to stop (or it auto-stops on pause)  
5. Edit manually as needed

Supported in Chrome, Edge, iOS/Android Safari (keyboards with mic).

---

## 🛠️  Troubleshooting

| Issue | Fix |
|-------|-----|
| Blank page post-deploy | Confirm `VITE_*` env vars and build settings |
| 401/403 from Supabase | Check URL/key and RLS policies |
| Mic disabled tooltip | Browser lacks Web Speech support – switch to Chrome |
| PDP not archiving | Ensure `active` boolean exists and Supabase role can `update` |
| Local dev CORS | Add `http://localhost:5173` to Supabase **Auth → Redirect URLs** |

---

## 🤝  Contributing
1. Fork → Branch → PR  
2. Follow existing ESLint / Prettier rules (`pnpm lint --fix`)  
3. Describe _why_ your change helps coaches.

---

## 📄  License
MIT – do whatever you want, just don’t sue us.
