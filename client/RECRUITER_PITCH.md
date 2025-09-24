I just scanned the frontend (React) and backend (Express) to map features, state, and components to files so you can confidently describe it.

### How to explain this project to a recruiter
- It’s a full‑stack notes app with Google login. The frontend is React (Vite + React Router + Context) styled with Tailwind and animated with Framer Motion. The backend is Express with Passport for Google OAuth and a Postgres database.  
- After signing in, users can create, edit, search, and delete notes. Notes are user‑scoped on the server, and the Notes page uses client-side search for instant filtering.  
- The app has a clean, responsive UI with subtle motion, a protected route for the notes dashboard, and a small component system (Header, Modal, NoteCard, Button).  
- I focused on pragmatic architecture: Context for auth, Axios instance for API calls, guarded routes, and RESTful CRUD endpoints.

### Why I used specific React hooks and components (and where)
- useState: local UI state like lists, form fields, loaders, and dialogs.
  - Notes list, loading, search query, and “editing” modal:
    ```52:60:client/src/pages/Notes.jsx
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(null);
    ```
  - Auth user and initial loading state:
    ```6:11:client/src/auth/AuthContext.jsx
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    ```
- useEffect: side effects like fetching on mount.
  - Load notes once:
    ```24:24:client/src/pages/Notes.jsx
    useEffect(() => { loadNotes(); }, []);
    ```
  - Hydrate current user from session:
    ```19:31:client/src/auth/AuthContext.jsx
    useEffect(() => {
      async function fetchMe() { /* ... */ }
      fetchMe();
    }, [api]);
    ```
- useMemo: memoize derived data or singletons.
  - Filtered notes by search:
    ```44:49:client/src/pages/Notes.jsx
    const filtered = useMemo(() => {
      const q = search.toLowerCase();
      return notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }, [notes, search]);
    ```
  - Stable Axios instance with baseURL and cookies:
    ```10:17:client/src/auth/AuthContext.jsx
    const api = useMemo(() => {
      const instance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
        withCredentials: true,
      });
      return instance;
    }, []);
    ```
- Context (AuthProvider + useAuth): app‑wide auth state and API access.
  ```6:15:client/src/App.jsx
  <AuthProvider>
    <BrowserRouter>
      <Header />
      {/* routes */}
    </BrowserRouter>
  </AuthProvider>
  ```
- ProtectedRoute: guard the notes page until user is authenticated.
  ```8:13:client/src/App.jsx
  function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/" replace />;
    return children;
  }
  ```
- Components:
  - Header: shows brand, nav, and conditionally renders login/logout + avatar via `useAuth`.
    ```37:63:client/src/components/Header.jsx
    const { user, login, logout } = useAuth();
    {user ? (/* avatar + logout */) : (<Button onClick={login}>Login with Google</Button>)}
    ```
  - Modal: reusable animated dialog for editing notes.
    ```85:113:client/src/pages/Notes.jsx
    <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={...} footer={...}>
      {/* title + textarea bound to editing state */}
    </Modal>
    ```
  - NoteCard: compact, animated card with Edit/Delete actions.
    ```3:12:client/src/components/NoteCard.jsx
    <button onClick={() => onEdit(note)}>Edit</button>
    <button onClick={() => onDelete(note.id)}>Delete</button>
    ```
  - AnimatedBackground, Button: visual polish and consistent UI.

### How authentication and data flow work
- Frontend: `AuthContext` stores `user`, exposes `login()` (redirects to `/auth/google`) and `logout()`, and provides an Axios `api` instance with cookies.
- Routing: `/` is public (Home), `/notes` is protected (redirect if not logged in).
- Backend:
  - Google OAuth: start at `/api/auth/google`, callback at `/api/auth/google/callback`, session powered. Current user at `/api/auth/me`, logout at `/api/auth/logout`.
    ```6:19:server/src/routes/auth.js
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failure' }), (req, res) => {
      const redirectUrl = process.env.FRONTEND_SUCCESS_REDIRECT || 'http://localhost:5173';
      res.redirect(redirectUrl);
    });
    ```
  - Notes CRUD (all require auth):
    ```7:15:server/src/routes/notes.js
    router.get('/', requireAuth, async (req, res) => { /* list user notes */ });
    ```
    ```17:28:server/src/routes/notes.js
    router.post('/', requireAuth, async (req, res) => { /* create */ });
    ```
    ```42:56:server/src/routes/notes.js
    router.put('/:id', requireAuth, async (req, res) => { /* update */ });
    ```
    ```58:65:server/src/routes/notes.js
    router.delete('/:id', requireAuth, async (req, res) => { /* delete */ });
    ```

### A short recruiter-facing pitch you can use
- “I built a full‑stack notes app with Google sign‑in. The frontend uses React with Context for authentication, React Router for navigation, Tailwind for styling, and Framer Motion for subtle animations. Notes are searchable on the client and editable in a modal. The backend is Express with Passport for Google OAuth and Postgres for storage, exposing RESTful, user‑scoped CRUD endpoints. I used hooks like useState for UI state, useEffect for data fetching, and useMemo for performant filtering and a stable Axios client. The notes dashboard is a protected route that only loads for authenticated users.”

- If they ask “where”: point to `client/src/pages/Notes.jsx` for state and UI logic, `client/src/auth/AuthContext.jsx` for auth and API, `client/src/components/*` for reusable UI, and `server/src/routes/*` for auth and notes endpoints.



