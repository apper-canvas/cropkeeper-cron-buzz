import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import getIcon from './utils/iconUtils';

// Page imports
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CropsPage from './pages/CropsPage';
import TasksPage from './pages/TasksPage';
import ExpensesPage from './pages/ExpensesPage';
import NotFound from './pages/NotFound';
import WeatherPage from './pages/WeatherPage';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath === '/login' || currentPath === '/signup';
        if (user) {
          // Save user to Redux store
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
          
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
        } else {
          // Clear user from Redux store
          dispatch(clearUser());
          
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                  ? `/login?redirect=${currentPath}`
                  : '/login'
            );
          } else if (redirectPath) {
            navigate(`/login?redirect=${redirectPath}`);
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed: " + (error.message || "Unknown error"));
      }
    });
    
    setIsInitialized(true);
  }, [dispatch, navigate]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    user,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.info("You have been logged out");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed: " + (error.message || "Unknown error"));
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isInitialized) {
      return <div className="loading flex items-center justify-center min-h-screen">Initializing application...</div>;
    }
    
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      navigate(`/login?redirect=${currentPath}`);
      return null;
    }
    
    return children;
  };

  return (
    <AuthContext.Provider value={authMethods}>
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
        <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
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
    </AuthContext.Provider>
  );
}

export default App;