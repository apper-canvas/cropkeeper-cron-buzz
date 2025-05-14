import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../App';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { useGetRecentItems } from '../services/dashboardService';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const { recentCrops, recentTasks, recentExpenses, isLoading, error } = useGetRecentItems();
  
  const TractorIcon = getIcon('Tractor');
  const SeedlingIcon = getIcon('Seedling');
  const ListTodoIcon = getIcon('ListTodo');
  const BanknoteIcon = getIcon('Banknote');
  const CloudSunIcon = getIcon('CloudSun');
  const LogOutIcon = getIcon('LogOut');
  const UserIcon = getIcon('User');

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <TractorIcon className="mr-3 h-8 w-8 text-primary" />
                CropKeeper
              </h1>
              <p className="mt-1 text-surface-600 dark:text-surface-400">
                Farm management system
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white dark:bg-surface-800 rounded-full px-4 py-2 shadow-sm">
                <UserIcon className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                <LogOutIcon className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </header>
        
        {/* Main Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/crops">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg h-full flex flex-col"
            >
              <SeedlingIcon className="h-10 w-10 mb-3" />
              <h2 className="text-xl font-bold mb-1">Crops</h2>
              <p className="text-white/80 text-sm mt-auto">Manage all your farm crops</p>
            </motion.div>
          </Link>
          
          <Link to="/tasks">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg h-full flex flex-col"
            >
              <ListTodoIcon className="h-10 w-10 mb-3" />
              <h2 className="text-xl font-bold mb-1">Tasks</h2>
              <p className="text-white/80 text-sm mt-auto">Track and manage tasks</p>
            </motion.div>
          </Link>
          
          <Link to="/expenses">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6 shadow-lg h-full flex flex-col"
            >
              <BanknoteIcon className="h-10 w-10 mb-3" />
              <h2 className="text-xl font-bold mb-1">Expenses</h2>
              <p className="text-white/80 text-sm mt-auto">Track farm expenditures</p>
            </motion.div>
          </Link>
          
          <Link to="/weather">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg h-full flex flex-col"
            >
              <CloudSunIcon className="h-10 w-10 mb-3" />
              <h2 className="text-xl font-bold mb-1">Weather</h2>
              <p className="text-white/80 text-sm mt-auto">Check weather forecasts</p>
            </motion.div>
          </Link>
        </div>
        
        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Crops */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
              <h3 className="font-semibold flex items-center">
                <SeedlingIcon className="h-5 w-5 mr-2 text-green-500" />
                Recent Crops
              </h3>
              <Link to="/crops" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="p-4">
              {isLoading ? (
                <p className="text-center py-6 text-surface-500">Loading recent crops...</p>
              ) : error ? (
                <p className="text-center py-6 text-red-500">Failed to load recent crops</p>
              ) : recentCrops.length > 0 ? (
                <ul className="divide-y divide-surface-200 dark:divide-surface-700">
                  {recentCrops.map(crop => (
                    <li key={crop.Id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{crop.Name}</p>
                          <p className="text-sm text-surface-500 dark:text-surface-400">{crop.variety}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          crop.status === 'planted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          crop.status === 'growing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-6 text-surface-500">No recent crops found</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;