// Mock weather service to simulate API calls
// This could be replaced with a real weather API in production

const mockWeatherData = {
  farms: [
    {
      id: 1,
      name: "Green Valley Farm",
      location: "North County",
      currentWeather: {
        temperature: 72,
        feelsLike: 74,
        humidity: 65,
        windSpeed: 8,
        windDirection: "NW",
        precipitation: 0,
        condition: "Partly Cloudy",
        icon: "cloud-sun"
      },
      forecast: [
        { day: "Today", high: 74, low: 62, condition: "Partly Cloudy", icon: "cloud-sun", precipitation: 10 },
        { day: "Tomorrow", high: 78, low: 64, condition: "Sunny", icon: "sun", precipitation: 0 },
        { day: "Wednesday", high: 80, low: 66, condition: "Sunny", icon: "sun", precipitation: 0 },
        { day: "Thursday", high: 76, low: 65, condition: "Cloudy", icon: "cloud", precipitation: 30 },
        { day: "Friday", high: 72, low: 63, condition: "Rain", icon: "cloud-rain", precipitation: 80 }
      ],
      alerts: [
        { type: "warning", message: "Light frost possible Wednesday night - protect sensitive crops" }
      ]
    },
    {
      id: 2,
      name: "Riverside Fields",
      location: "Eastern Plains",
      currentWeather: {
        temperature: 76,
        feelsLike: 79,
        humidity: 70,
        windSpeed: 5,
        windDirection: "SE",
        precipitation: 40,
        condition: "Scattered Showers",
        icon: "cloud-drizzle"
      },
      forecast: [
        { day: "Today", high: 76, low: 65, condition: "Scattered Showers", icon: "cloud-drizzle", precipitation: 40 },
        { day: "Tomorrow", high: 75, low: 66, condition: "Partly Cloudy", icon: "cloud-sun", precipitation: 20 },
        { day: "Wednesday", high: 79, low: 68, condition: "Sunny", icon: "sun", precipitation: 0 },
        { day: "Thursday", high: 82, low: 69, condition: "Sunny", icon: "sun", precipitation: 0 },
        { day: "Friday", high: 80, low: 67, condition: "Partly Cloudy", icon: "cloud-sun", precipitation: 10 }
      ],
      alerts: [
        { type: "info", message: "Ideal conditions for planting mid-week" },
        { type: "warning", message: "High humidity may increase risk of fungal diseases" }
      ]
    }
  ]
};

// Get list of farms with basic info
export const getFarms = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockWeatherData.farms.map(farm => ({
        id: farm.id,
        name: farm.name,
        location: farm.location
      })));
    }, 300);
  });
};

// Get current weather for a specific farm
export const getCurrentWeather = (farmId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const farm = mockWeatherData.farms.find(f => f.id === farmId);
      resolve(farm ? farm.currentWeather : null);
    }, 500);
  });
};

// Get forecast for a specific farm
export const getForecast = (farmId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const farm = mockWeatherData.farms.find(f => f.id === farmId);
      resolve(farm ? farm.forecast : []);
    }, 500);
  });
};

// Get weather alerts for a specific farm
export const getWeatherAlerts = (farmId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const farm = mockWeatherData.farms.find(f => f.id === farmId);
      resolve(farm ? farm.alerts : []);
    }, 400);
  });
};