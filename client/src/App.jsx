import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './auth/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Notes from './pages/Notes.jsx';
import Header from './components/Header.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-zinc-500">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

// Header moved to separate component for better styling

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}
