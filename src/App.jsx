import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Page imports
import Home from './pages/Home';
import CropsPage from './pages/CropsPage';
import TasksPage from './pages/TasksPage';
import ExpensesPage from './pages/ExpensesPage';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Icons
  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <motion.button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200 shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </motion.button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crops" element={<CropsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-lg shadow-soft"
      />
    </>
  );
}

export default App;