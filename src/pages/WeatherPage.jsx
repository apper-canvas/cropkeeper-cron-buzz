import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import getIcon from '../utils/iconUtils';
import { getFarms, getCurrentWeather, getForecast, getWeatherAlerts } from '../services/weatherService';

function WeatherPage() {
  const navigate = useNavigate();
  
  // Icons
  const navigate = useNavigate();
  const LayoutDashboardIcon = getIcon('LayoutDashboard');
  const SproutIcon = getIcon('Sprout');
  const ListTodoIcon = getIcon('ListTodo');
  const BanknoteIcon = getIcon('Banknote');
  const CloudSunIcon = getIcon('CloudSun');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const ThermometerIcon = getIcon('Thermometer');
  const DropletIcon = getIcon('Droplet');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const WindIcon = getIcon('Wind');
  const UmbrellaIcon = getIcon('Umbrella');
  const AlertTriangleIcon = getIcon('AlertTriangle');
  const SunIcon = getIcon('Sun');
  const CloudIcon = getIcon('Cloud');
  const CloudRainIcon = getIcon('CloudRain');
  const CloudDrizzleIcon = getIcon('CloudDrizzle');
  const RefreshCcwIcon = getIcon('RefreshCcw');
  const InfoIcon = getIcon('Info');
  
  // State variables
  const [activeTab, setActiveTab] = useState('weather');
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    localStorage.setItem('activeTab', 'weather');
    loadFarmData();
  }, []);
  
  useEffect(() => {
    if (selectedFarm) {
      loadWeatherData(selectedFarm);
    }
  }, [selectedFarm]);
  
  const loadFarmData = async () => {
    try {
      setIsLoading(true);
      const farmsData = await getFarms();
      setFarms(farmsData);
      
      // Select the first farm by default
      if (farmsData.length > 0) {
        setSelectedFarm(farmsData[0].id);
      }
    } catch (error) {
      toast.error("Failed to load farm data. Please try again.");
      console.error("Error loading farms:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadWeatherData = async (farmId) => {
    setIsLoading(true);
    try {
      const [weatherData, forecastData, alertsData] = await Promise.all([
        getCurrentWeather(farmId),
        getForecast(farmId),
        getWeatherAlerts(farmId)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setAlerts(alertsData);
    } catch (error) {
      toast.error("Failed to load weather data. Please try again.");
      console.error("Error loading weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshWeatherData = () => {
    if (selectedFarm) {
      toast.info("Refreshing weather data...");
      loadWeatherData(selectedFarm);
    }
  };
  
  const getWeatherIcon = (iconName) => {
    switch (iconName) {
      case 'sun': return SunIcon;
      case 'cloud': return CloudIcon;
      case 'cloud-rain': return CloudRainIcon;
      case 'cloud-drizzle': return CloudDrizzleIcon;
      case 'cloud-sun': return CloudSunIcon;
      default: return CloudSunIcon;
    }
  };
  
  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboardIcon, path: '/' },
    { id: 'crops', label: 'Crops', icon: SproutIcon, path: '/crops' },
    { id: 'tasks', label: 'Tasks', icon: ListTodoIcon, path: '/tasks' },
    { id: 'expenses', label: 'Expenses', icon: BanknoteIcon, path: '/expenses' },
    { id: 'weather', label: 'Weather', icon: CloudSunIcon, path: '/weather' },
  ];
  
  const handleTabChange = (tabId) => {
    const targetTab = tabItems.find(tab => tab.id === tabId);
    
    if (targetTab) {
      setActiveTab(tabId);
      localStorage.setItem('activeTab', tabId);
      
      if (targetTab.path !== '/weather') {
        navigate(targetTab.path);
      }
    }
  };
  
  const handleFarmChange = (e) => {
    setSelectedFarm(Number(e.target.value));
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
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg mb-4 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to Dashboard"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Dashboard
          </motion.button>
          
              className="btn bg-white text-primary hover:bg-surface-100 font-semibold self-start"
              onClick={() => navigate('/')}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h2 className="text-2xl font-semibold flex items-center mb-4 md:mb-0">
            <CloudSunIcon className="mr-2 h-6 w-6 text-primary" />
            Weather Information
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="input max-w-[240px]"
              value={selectedFarm || ''}
              onChange={handleFarmChange}
              disabled={isLoading || farms.length === 0}
            >
              {farms.length === 0 && <option value="">No farms available</option>}
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>
                  {farm.name} ({farm.location})
                </option>
              ))}
            </select>
            
            <motion.button
              onClick={refreshWeatherData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading || !selectedFarm}
              className="btn btn-secondary flex items-center justify-center"
            >
              <RefreshCcwIcon className="h-4 w-4 mr-2" />
              Refresh Data
            </motion.button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weather Alerts */}
            {alerts.length > 0 && (
              <section className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center mb-3">
                  <AlertTriangleIcon className="h-5 w-5 mr-2" />
                  Weather Alerts
                </h3>
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start p-3 rounded-lg text-sm ${
                        alert.type === 'warning' 
                          ? 'bg-amber-100 dark:bg-amber-800/30 text-amber-800 dark:text-amber-200' 
                          : 'bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-200'
                      }`}
                    >
                      {alert.type === 'warning' ? (
                        <AlertTriangleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      ) : (
                        <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                      )}
                      <p>{alert.message}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Current Weather */}
            {currentWeather && (
              <section className="bg-white dark:bg-surface-800 rounded-xl shadow-card">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Current Conditions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                      {React.createElement(getWeatherIcon(currentWeather.icon), { 
                        className: "h-12 w-12 text-primary mb-2"
                      })}
                      <div className="text-3xl font-semibold mb-1">{currentWeather.temperature}°F</div>
                      <div className="text-surface-600 dark:text-surface-300">{currentWeather.condition}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <ThermometerIcon className="h-5 w-5 text-amber-500 mr-2" />
                        <div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">Feels Like</div>
                          <div className="font-medium">{currentWeather.feelsLike}°F</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <DropletIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">Humidity</div>
                          <div className="font-medium">{currentWeather.humidity}%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <WindIcon className="h-5 w-5 text-teal-500 mr-2" />
                        <div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">Wind</div>
                          <div className="font-medium">{currentWeather.windSpeed} mph {currentWeather.windDirection}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <UmbrellaIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        <div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">Precip. Chance</div>
                          <div className="font-medium">{currentWeather.precipitation}%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex flex-col">
                      <h4 className="text-sm font-medium text-surface-600 dark:text-surface-300 mb-2">Farming Impact</h4>
                      <div className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 flex-1">
                        <p className="text-sm">
                          {currentWeather.precipitation > 30 
                            ? "High precipitation may affect field work and increase disease pressure." 
                            : currentWeather.humidity > 80
                              ? "High humidity may increase disease pressure in susceptible crops."
                              : currentWeather.windSpeed > 15
                                ? "Strong winds may affect spraying operations and cause mechanical damage."
                                : "Current conditions are favorable for field operations."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
            
            {/* 5-day Forecast */}
            {forecast.length > 0 && (
              <section className="bg-white dark:bg-surface-800 rounded-xl shadow-card">
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-4">5-Day Forecast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {forecast.map((day, index) => (
                      <div 
                        key={index} 
                        className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 flex flex-col items-center"
                      >
                        <div className="font-medium mb-2">{day.day}</div>
                        {React.createElement(getWeatherIcon(day.icon), { 
                          className: "h-8 w-8 text-primary mb-2"
                        })}
                        <div className="text-sm text-surface-500 dark:text-surface-400 mb-1">{day.condition}</div>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="font-medium">{day.high}°</span>
                          <span className="text-surface-500 dark:text-surface-400">{day.low}°</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <UmbrellaIcon className="h-3 w-3 mr-1 text-blue-500" />
                          <span>{day.precipitation}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
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
    </div>
  );
}

export default WeatherPage;