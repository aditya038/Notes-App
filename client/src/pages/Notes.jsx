import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import NoteCard from '../components/NoteCard.jsx';
import Button from '../components/Button.jsx';
import Modal from '../components/Modal.jsx';
import { PlusIcon } from '../components/Icons.jsx';

export default function Notes() {
  const { api } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);

  async function loadNotes() {
    setLoading(true);
    const { data } = await api.get('/notes');
    setNotes(data);
    setLoading(false);
  }

  useEffect(() => { loadNotes(); }, []);

  async function createNote() {
    const { data } = await api.post('/notes', { title: 'Untitled', content: '' });
    setNotes(prev => [data, ...prev]);
    setEditing(data);
  }

  async function saveNote(note) {
    const { data } = await api.put(`/notes/${note.id}`, { title: note.title, content: note.content });
    setNotes(prev => prev.map(n => n.id === data.id ? data : n));
    setEditing(null);
  }

  async function deleteNote(id) {
    await api.delete(`/notes/${id}`);
    setNotes(prev => prev.filter(n => n.id !== id));
    if (editing?.id === id) setEditing(null);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <div className="min-h-screen relative bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <AnimatedBackground />
      <div className="mx-auto max-w-6xl px-4 py-8 relative">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Button onClick={createNote}><PlusIcon className="mr-1" /> New Note</Button>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-zinc-500">Loading notes…</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((note, idx) => (
                <motion.div key={note.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: idx * 0.03 }}>
                  {editing?.id === note.id ? (
                    <NoteCard note={note} onEdit={setEditing} onDelete={deleteNote} />
                  ) : (
                    <NoteCard note={note} onEdit={setEditing} onDelete={deleteNote} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing ? `Edit: ${editing.title || 'Untitled'}` : ''}
        footer={(
          <>
            <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            <button onClick={() => saveNote(editing)} className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Save</button>
          </>
        )}
      >
        {editing ? (
          <div className="flex flex-col gap-3">
            <input
              value={editing.title}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Title"
            />
            <textarea
              value={editing.content}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
              rows={10}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Start typing..."
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function NoteEditor({ note, onChange, onCancel, onSave }) {
  return (
    <div className="flex flex-col gap-3">
      <input
        value={note.title}
        onChange={e => onChange({ ...note, title: e.target.value })}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Title"
      />
      <textarea
        value={note.content}
        onChange={e => onChange({ ...note, content: e.target.value })}
        rows={8}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/70 dark:bg-zinc-800/70 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="Start typing..."
      />
      <div className="flex items-center justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1.5 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
        <button onClick={() => onSave(note)} className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Save</button>
      </div>
    </div>
  );
}


