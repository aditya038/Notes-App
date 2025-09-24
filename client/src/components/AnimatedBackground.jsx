import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-brand-300/40 blur-3xl dark:bg-brand-700/30"
        animate={{ x: [0, 40, -20, 0], y: [0, 20, -30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-300/40 blur-3xl dark:bg-fuchsia-700/30"
        animate={{ x: [0, -30, 10, 0], y: [0, -10, 20, 0], scale: [1, 0.9, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.5),rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(24,24,27,0.7),rgba(24,24,27,0)_60%)]" />
      <div className="absolute inset-0 bg-grid-zinc-200/[0.15] dark:bg-grid-zinc-800/[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
    </div>
  );
}


