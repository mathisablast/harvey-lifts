# Publishing Your EDGE Training Tracker

This is a complete, ready-to-deploy web app. Follow these steps to get it on your
phone as a real app icon. Budget about 30–45 minutes the first time. Everything
here is free.

---

## What you have

A standalone React app (built with Vite). Your workout logging saves to your
phone's browser storage, so it persists between sessions. No accounts, no
database, no monthly fees.

```
edge-app/
├── index.html              ← page shell + "Add to Home Screen" setup
├── package.json            ← dependency list
├── vite.config.js          ← build config
├── public/
│   ├── manifest.webmanifest ← makes it installable as an app
│   ├── icon-192.png         ← app icon
│   └── icon-512.png         ← app icon
└── src/
    ├── main.jsx            ← entry point
    └── App.jsx             ← the whole app (program, logging, charts)
```

---

## The simplest path: Vercel (recommended)

Vercel hosts the app for free and gives you a URL like `mat-edge.vercel.app`.

### Step 1 — Make a GitHub account (if you don't have one)
Go to https://github.com and sign up. Free.

### Step 2 — Put this code on GitHub
Easiest way, no command line:
1. On GitHub, click the **+** (top right) → **New repository**.
2. Name it `edge-tracker`, leave it Public or Private, click **Create repository**.
3. On the new repo page, click **uploading an existing file**.
4. Drag in the **entire contents** of the `edge-app` folder (the index.html,
   package.json, the `src` and `public` folders, etc.). Keep the folder
   structure intact.
5. Click **Commit changes**.

### Step 3 — Deploy with Vercel
1. Go to https://vercel.com and click **Sign Up** → continue with GitHub.
2. Click **Add New… → Project**.
3. Find your `edge-tracker` repo and click **Import**.
4. Vercel auto-detects Vite. You don't need to change anything — just click
   **Deploy**.
5. Wait about a minute. You'll get a live URL.

That URL is your app. Open it on any device.

---

## Put it on your phone's home screen

Once you have the URL, open it on your phone:

**iPhone (Safari):**
1. Open the URL in Safari.
2. Tap the **Share** button (square with an up arrow).
3. Scroll down, tap **Add to Home Screen**.
4. Tap **Add**.

**Android (Chrome):**
1. Open the URL in Chrome.
2. Tap the **⋮** menu (top right).
3. Tap **Add to Home screen** / **Install app**.

Now you have an EDGE icon that opens full-screen, no browser bars, just like a
native app. Your logged workouts stay saved on that device.

---

## Updating the app later

If you want changes (I can make them), you'll get an updated `App.jsx`. Just
replace that one file in your GitHub repo (click the file → pencil icon → paste →
commit), and Vercel automatically rebuilds and updates your live app within a
minute. Nothing to reinstall on your phone.

---

## Alternative: Netlify Drop (no GitHub at all)

If you'd rather skip GitHub entirely and you're OK running two commands:
1. Install Node.js from https://nodejs.org (the LTS version).
2. Open Terminal, navigate into the `edge-app` folder, and run:
   ```
   npm install
   npm run build
   ```
   This creates a `dist` folder.
3. Go to https://app.netlify.com/drop and drag the **`dist` folder** onto the
   page. You get an instant live URL.

The tradeoff: to update it, you rebuild and re-drag. The Vercel + GitHub path
auto-updates, which is why it's the recommendation.

---

## A note on your data

Your workout history lives in your phone browser's local storage. That means:
- It persists between sessions and survives closing the app. ✅
- It stays on the one device you use. It won't appear on a second device.
- If you clear your browser data / site data, it gets wiped. (Logging a backup
  export is something I can add if you want a safety net.)

If you ever decide you want your log to sync across phone + laptop, tell me and I
can wire it to a free cloud database (Supabase). For one-device use, what you
have is simpler and works offline.
