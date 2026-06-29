# EDGE Training Tracker

A 12-week strength & recomp training tracker. Two basement-gym days and two
full-gym days per week, with per-set logging, automatic weight progression, and
progress charts.

**To publish and use it, see [DEPLOY.md](./DEPLOY.md).**

## Run locally (optional)
```
npm install
npm run dev
```
Then open the URL it prints (usually http://localhost:5173).

## Tech
- React + Vite
- recharts for progress charts
- Browser localStorage for persistence (single device, offline-capable)
