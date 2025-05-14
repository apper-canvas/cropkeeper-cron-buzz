import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import MainFeature from '../components/MainFeature';
import AddFarmModal from '../components/AddFarmModal';
import getIcon from '../utils/iconUtils';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab based on the last visited tab or default to dashboard
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'dashboard';
  });
  
  // Icons
  const LayoutDashboardIcon = getIcon('LayoutDashboard');
  const SproutIcon = getIcon('Sprout');
  const ListTodoIcon = getIcon('ListTodo');
  const BanknoteIcon = getIcon('Banknote');
  const CloudSunIcon = getIcon('CloudSun');
  
  // Sample data for the farm cards
  const [farms, setFarms] = useState([
    { id: 1, name: "Green Valley Farm", location: "North County", size: "24 acres", crops: 4, tasks: 6 },
    { id: 2, name: "Riverside Fields", location: "Eastern Plains", size: "16 acres", crops: 2, tasks: 3 },
  ]);
  
  const [isAddFarmModalOpen, setIsAddFarmModalOpen] = useState(false);
  
  const addFarm = (newFarm) => {
    setFarms(prevFarms => [...prevFarms, newFarm]);
  };
  
  const handleAddFarmClick = () => setIsAddFarmModalOpen(true);
  const handleCloseModal = () => setIsAddFarmModalOpen(false);

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, path: '/' },
    { id: 'crops', label: 'Crops', icon: SproutIcon, path: '/crops' },
    { id: 'tasks', label: 'Tasks', icon: ListTodoIcon, path: '/tasks' },
    { id: 'expenses', label: 'Expenses', icon: BanknoteIcon, path: '/expenses' },
    { id: 'weather', label: 'Weather', icon: CloudSunIcon, path: '/weather' },
  ];

  // Handle tab changes - either change the active tab or navigate to a different route
  const handleTabChange = (tabId) => {
    const targetTab = tabItems.find(tab => tab.id === tabId);
    
    if (targetTab) {
      setActiveTab(tabId);
      localStorage.setItem('activeTab', tabId);
      
      if (location.pathname !== targetTab.path) {
        navigate(targetTab.path);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <SproutIcon className="mr-2 h-8 w-8" />
                CropKeeper
              </h1>
              <p className="text-primary-light/80 mt-1">Simplify your farm management</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn bg-white text-primary hover:bg-surface-100 font-semibold self-start"
            >
              Quick Actions
            </motion.button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-surface-800 shadow-md sticky top-0 z-30">
        <div className="container mx-auto">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="flex min-w-max px-4">
              {tabItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center px-4 py-4 border-b-2 transition-all ${
                    activeTab === item.id
                      ? 'border-primary text-primary dark:text-primary-light font-medium'
                      : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-primary hover:dark:text-primary-light'
                  }`}
                >
                  <item.icon className={`mr-2 h-5 w-5 ${
                    activeTab === item.id
                      ? 'text-primary dark:text-primary-light'
                      : 'text-surface-600 dark:text-surface-400'
                  }`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Farms</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farms.map(farm => (
                  <motion.div
                    key={farm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="neu-card hover:shadow-soft transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold mb-2">{farm.name}</h3>
                    <div className="text-sm text-surface-600 dark:text-surface-300 mb-4">{farm.location} • {farm.size}</div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <SproutIcon className="h-4 w-4 mr-1 text-primary" />
                        <span>{farm.crops} crops</span>
                      </div>
                      <div className="flex items-center">
                        <ListTodoIcon className="h-4 w-4 mr-1 text-secondary" />
                        <span>{farm.tasks} tasks</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddFarmClick}
                  className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-xl flex flex-col items-center justify-center p-6 h-full min-h-[180px] cursor-pointer"
                >
                  <div className="bg-surface-100 dark:bg-surface-700 rounded-full p-3 mb-3">
                    <SproutIcon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-center">Add a new farm</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 text-center mt-1">Click to create a new farm</p>
                </motion.div>
              </div>
            </section>
            
            <MainFeature />
          </div>
        )}
        
      </main>

      {/* Footer */}
      <footer className="bg-surface-200 dark:bg-surface-800 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-surface-600 dark:text-surface-400 text-sm">
            <p>© 2023 CropKeeper. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ for farmers everywhere</p>
          </div>
        </div>
      </footer>
      
      {/* Add Farm Modal */}
      <AddFarmModal 
        isOpen={isAddFarmModalOpen} 
        onClose={handleCloseModal}
        onAddFarm={addFarm}
      />
    </div>
  );
}

export default Home;