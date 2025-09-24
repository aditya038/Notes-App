import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/90 p-0 shadow-2xl backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/80"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
          >
            <div className="flex items-center justify-between border-b border-zinc-200/60 px-5 py-3 dark:border-zinc-800/60">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">✕</button>
            </div>
            <div className="px-5 py-4">{children}</div>
            {footer ? <div className="flex items-center justify-end gap-2 border-t border-zinc-200/60 px-5 py-3 dark:border-zinc-800/60">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}


