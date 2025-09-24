import { motion } from 'framer-motion';

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col h-full">
        <h3 className="font-semibold text-lg line-clamp-1">{note.title || 'Untitled'}</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 whitespace-pre-wrap">{note.content || 'No content yet.'}</p>
        <div className="mt-auto flex items-center justify-end gap-2 pt-4 opacity-0 group-hover:opacity-100 transition">
          <button onClick={() => onEdit(note)} className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">Edit</button>
          <button onClick={() => onDelete(note.id)} className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700">Delete</button>
        </div>
      </div>
    </motion.div>
  );
}


