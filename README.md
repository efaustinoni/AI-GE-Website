Node + Vite (React) + Bolt Database (Postgres) Starter
======================================================

This starter gives you:
- **Design tokens** (easy theming, light/dark)
- **Block-based pages** fetched from an API (Hero, RichText, Video, Gallery, FormCTA)
- **Forms** (Contact & AI Tool Security Scan) → stored in Postgres via Express API
- Sensible security defaults (helmet, CORS, server-side validation, rate-limiting)

Folder layout
-------------
- `server/` — Express API (uses `pg` to talk to Postgres)
- `web/` — Vite + React frontend with a small block-renderer

Quick start
-----------
1) Create a Postgres database (your environment's "Bolt Database") and grab the connection string.
2) Copy `.env.example` to `.env` in `server/` and set `DATABASE_URL` to your Postgres URL.
3) Install deps and run migrations:
   ```bash
   cd server
   npm i
   npm run db:setup   # creates tables + seeds a Home page
   npm run dev
   ```

4) In another terminal, run the frontend:
   ```bash
   cd web
   npm i
   npm run dev
   ```

5) Open the browser at the printed Vite URL (usually http://localhost:5173).

Environment variables (server/.env)
-----------------------------------
- `DATABASE_URL` — Postgres connection URL (e.g., `postgres://user:pass@host:5432/dbname`)
- `PORT` — API port (default 4000)
- `CORS_ORIGIN` — Allowed origin for the frontend (default `http://localhost:5173`)

Production tips
---------------
- Build the frontend (`npm run build` in `web/`) and serve the static files via a CDN or a web server.
- Deploy the API behind HTTPS, keep `helmet` enabled, and set a stricter CORS policy.
- Add ReCAPTCHA if you expect spam, and configure SMTP if you want email notifications.
