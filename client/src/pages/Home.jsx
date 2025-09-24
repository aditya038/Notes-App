import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';

export default function Home() {
  const { user, login } = useAuth();
  if (user) return <Navigate to="/notes" replace />;
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-brand-50 to-white dark:from-zinc-900 dark:to-zinc-950 text-zinc-800 dark:text-zinc-100">
      <AnimatedBackground />
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl font-extrabold tracking-tight">
          Your ideas, beautifully organized
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          Write, edit, and revisit your notes with a clean, fast and delightful interface.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 text-base text-zinc-600 dark:text-zinc-400"
        >
          Craft, organize, and revisit your thoughts with a calm, elegant interface.
          Use the header to sign in when you’re ready.
        </motion.p>
      </div>
      <section id="features" className="mx-auto max-w-5xl px-4 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Fast", "Simple", "Secure"].map((title, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/70">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Smooth animations, minimal UI, Google login, and your notes synced to Postgres.</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}


