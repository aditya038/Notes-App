import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/AuthContext.jsx';
import Button from './Button.jsx';

function BrandMark() {
  return (
    <div className="relative h-9 w-9 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-400 via-fuchsia-400 to-cyan-400 opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_40%)]" />
    </div>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative px-3 py-1.5 text-sm rounded-md transition hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 ${
          isActive ? 'text-brand-700 dark:text-brand-300' : 'text-zinc-700 dark:text-zinc-300'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive ? (
            <motion.span layoutId="nav-underline" className="absolute left-1 right-1 -bottom-[2px] h-[2px] rounded-full bg-brand-500" />
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export default function Header() {
  const { user, login, logout } = useAuth();
  return (
    <div className="sticky top-0 z-50">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white/70 to-transparent dark:from-zinc-950/60" />
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-900/60 border-b border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <BrandMark />
            <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Notes</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/notes">Notes</NavItem>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="h-8 w-8 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-700" />
                ) : null}
                <Button onClick={logout} className="hidden sm:inline-flex">Logout</Button>
                <Button onClick={logout} variant="secondary" className="sm:hidden px-2 py-1">Logout</Button>
              </>
            ) : (
              <Button onClick={login}>Login with Google</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


