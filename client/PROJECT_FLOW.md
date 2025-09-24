## Project Flow — End‑to‑End

### 1) App bootstrap
- `main.jsx` mounts `<App />`.
- `App.jsx` wraps everything in `AuthProvider`, sets up `BrowserRouter`, renders persistent `Header`, and defines routes.
- `ProtectedRoute` guards `/notes` by checking `useAuth()` → `user` and `loading`.

### 2) Auth lifecycle (Google OAuth)
1. On load, `AuthContext` runs `GET /api/auth/me` to hydrate `user`.
2. If user clicks “Login with Google” in `Header`, browser navigates to `/api/auth/google`.
3. After Google consent, backend handles `/api/auth/google/callback`, creates a session, and redirects back to the frontend (default `http://localhost:5173`).
4. `AuthContext` now returns a non‑null `user`; protected pages render.
5. Logout calls `POST /api/auth/logout`, clears session; `user` becomes `null`.

### 3) Navigation and pages
- `/` → `Home.jsx` (public landing with animations). If already authenticated, it redirects to `/notes`.
- `/notes` → `Notes.jsx` (protected). If unauthenticated, `ProtectedRoute` redirects to `/`.

### 4) Notes dashboard flow
1. On mount, `Notes.jsx` calls `loadNotes()` → `GET /api/notes` via shared Axios `api` (with credentials).
2. Notes are stored in `notes` state. `search` is local state; `filtered` is computed with `useMemo`.
3. Create note: `POST /api/notes` → prepend to `notes` → open editor modal by setting `editing`.
4. Edit note: change inputs bound to `editing` state → Save triggers `PUT /api/notes/:id` → update item in `notes`.
5. Delete note: `DELETE /api/notes/:id` → remove from `notes` and close modal if it was open for that note.

### 5) Frontend building blocks
- `AuthContext`: owns `user`, `loading`, `login()`, `logout()`, and shared Axios `api` instance (`withCredentials`, `baseURL`).
- `Header`: persistent top bar with brand, navigation, avatar, and login/logout actions using `useAuth()`.
- `Notes` page: owns UI state (`notes`, `loading`, `search`, `editing`) and orchestrates CRUD calls.
- `Modal`: reusable animated dialog for editing notes.
- `NoteCard`: displays a note with Edit/Delete actions.
- `AnimatedBackground` and `Button`: visuals and consistent UI.

### 6) Backend flow (Express)
- Auth routes (`server/src/routes/auth.js`):
  - `GET /api/auth/google` → starts OAuth with Passport Google strategy.
  - `GET /api/auth/google/callback` → verifies, creates session, redirects to frontend.
  - `GET /api/auth/me` → returns current session user (id, email, name, avatar_url) or `user: null`.
  - `POST /api/auth/logout` → destroys session and clears cookie.
- Notes routes (`server/src/routes/notes.js`) — all behind `requireAuth`:
  - `GET /api/notes` → list notes for `req.user.id`.
  - `POST /api/notes` → create note for `req.user.id`.
  - `GET /api/notes/:id` → fetch one note owned by `req.user.id`.
  - `PUT /api/notes/:id` → update note if owned by `req.user.id`.
  - `DELETE /api/notes/:id` → delete note if owned by `req.user.id`.

### 7) Data and security
- Session cookie persists login; Axios `api` is configured with `withCredentials` so cookies are sent automatically.
- All note operations are user‑scoped on the server using `req.user.id`.
- Client variables: `VITE_API_URL` can override the default API base URL.

### 8) Typical user journey
1. Visit `/` → view landing.
2. Click “Login with Google” → OAuth → redirected back, now authenticated.
3. Navigate to `/notes` (or auto‑redirect from Home if already logged in).
4. Create a new note → edit in modal → save.
5. Search notes instantly on the client.
6. Logout from Header → session cleared, access to `/notes` revoked.


