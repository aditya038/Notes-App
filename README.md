# NotesApp (React + Vite + Tailwind + Framer Motion | Node.js + Express + PostgreSQL + Google OAuth)

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Google Cloud OAuth credentials (Client ID & Secret)

## Project Structure
```
NotesApp/
  server/           # Node.js + Express backend
  client/           # React + Vite frontend
```

## 1) Backend setup
Create `server/.env` with the following values:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_SUCCESS_REDIRECT=http://localhost:5173
COOKIE_SECURE=false
SESSION_SECRET=change_me_dev_secret

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=notesapp
PGUSER=postgres
PGPASSWORD=postgres

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
```

Install and run the backend:
```bash
cd server
npm install
npm run dev
```
- Health check: `GET http://localhost:4000/api/health`
- Tables auto-create on boot: `users`, `notes`, `user_sessions`

## 2) Frontend setup
Create `client/.env` with the following values:

```env
VITE_API_URL=http://localhost:4000/api
```

Install and run the frontend:
```bash
cd client
npm install
npm run dev
```
Vite will start at `http://localhost:5173` (or next available port).

## OAuth setup (Google)
- Create a project in Google Cloud Console → OAuth Consent Screen
- Create OAuth client (type: Web application)
- Authorized redirect URI: `http://localhost:4000/api/auth/google/callback`
- Put Client ID and Secret in `server/.env`

## API Summary
- Auth
  - `GET /api/auth/google`
  - `GET /api/auth/google/callback`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Notes (session required)
  - `GET /api/notes`
  - `POST /api/notes` body `{ title, content }`
  - `GET /api/notes/:id`
  - `PUT /api/notes/:id` body `{ title?, content? }`
  - `DELETE /api/notes/:id`

## Tips
- If the frontend runs on a different port (e.g., 5174), update `FRONTEND_ORIGIN` in `server/.env`.
- For production set `COOKIE_SECURE=true` and use HTTPS.
