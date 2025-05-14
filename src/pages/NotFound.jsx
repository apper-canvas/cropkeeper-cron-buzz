import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

function NotFound() {
  // Icons
  const HomeIcon = getIcon('Home');
  const AlertCircleIcon = getIcon('AlertCircle');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-6 mb-3">
            <AlertCircleIcon className="h-16 w-16 text-red-500 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-50">404</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-surface-700 dark:text-surface-200">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          Oops! It seems like the page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-10 w-full max-w-md mx-auto px-4">
        <div className="text-center text-sm text-surface-500 dark:text-surface-400">
          <p>© 2023 CropKeeper. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;