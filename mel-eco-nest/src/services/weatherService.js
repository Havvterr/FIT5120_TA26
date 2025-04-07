import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather`, {
      params: { lat, lon },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

// Get API key from environment variable, or fallback to hardcoded value if not available
// Note: In production, you should use a server-side proxy to hide API keys
const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '26b7b3041941d8e7f9c186d59cbe2d91'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Melbourne area boundaries
const MELBOURNE_BOUNDS = {
  north: -37.5113,
  south: -38.0297,
  east: 145.3044,
  west: 144.5937,
}

// Predefined Melbourne districts/suburbs with coordinates
const MELBOURNE_DISTRICTS = [
  { name: 'CBD', lat: -37.8136, lng: 144.9631 },
  { name: 'Docklands', lat: -37.8152, lng: 144.9455 },
  { name: 'Fitzroy', lat: -37.798, lng: 144.9786 },
  { name: 'South Melbourne', lat: -37.8312, lng: 144.9532 },
  { name: 'St Kilda', lat: -37.865, lng: 144.9741 },
  { name: 'Footscray', lat: -37.801, lng: 144.9006 },
  { name: 'Kensington', lat: -37.7947, lng: 144.9333 },
  { name: 'Essendon', lat: -37.7533, lng: 144.9108 },
  { name: 'Clayton', lat: -37.915, lng: 145.1215 },
  // Adding locations further from Melbourne
  { name: 'Bunyip State Park', lat: -38.071, lng: 145.6378 },
  { name: 'Sunbury', lat: -37.5811, lng: 144.7286 },
  { name: 'Lake Eildon', lat: -37.2333, lng: 145.9167 },
  { name: "Animal Land Children's Farm", lat: -37.6568, lng: 144.9513 },
  { name: 'Thornhill Park', lat: -37.6866, lng: 144.5754 },
  { name: 'Kilmore', lat: -37.3004, lng: 144.9511 },
  { name: 'Lerderderg State Park', lat: -37.5353, lng: 144.3694 },
  { name: 'Enfield Forest', lat: -37.725, lng: 143.7167 },
]

export async function getMelbourneTemperatures() {
  try {
    const points = []

    // Using real API data
    for (const district of MELBOURNE_DISTRICTS) {
      try {
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: {
            lat: district.lat,
            lon: district.lng,
            appid: API_KEY,
            units: 'metric',
          },
        })

        if (response.data && response.data.main && response.data.main.temp) {
          points.push({
            name: district.name,
            lat: district.lat,
            lng: district.lng,
            value: response.data.main.temp, // Actual temperature in Celsius
          })
        }
      } catch (error) {
        console.error(`Error fetching temperature for ${district.name}:`, error)
      }
    }

    return points
  } catch (error) {
    console.error('Error in getMelbourneTemperatures:', error)
    return []
  }
}

export async function getCurrentMelbourneWeather() {
  try {
    // Get real weather data for Melbourne CBD
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: -37.8136,
        lon: 144.9631,
        appid: API_KEY,
        units: 'metric',
      },
    })

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
    }
  } catch (error) {
    console.error('Error fetching Melbourne weather:', error)
    // Return fallback data
    return {
      temperature: 15,
      humidity: 70,
      description: 'cloudy',
      icon: '04d',
    }
  }
}

/*
// Code for when switching to the real OpenWeatherMap API:

export async function getActualMelbourneTemperatures() {
  try {
    const points = [];

    // Use predefined districts instead of a grid
    for (const district of MELBOURNE_DISTRICTS) {
      try {
        const response = await axios.get(`${BASE_URL}/weather`, {
          params: {
            lat: district.lat,
            lng: district.lng,
            appid: API_KEY,
            units: 'metric'
          }
        });

        if (response.data && response.data.main && response.data.main.temp) {
          points.push({
            name: district.name,
            lat: district.lat,
            lng: district.lng,
            value: response.data.main.temp // Temperature in Celsius
          });
        }
      } catch (error) {
        console.error(`Error fetching temperature for ${district.name}:`, error);
      }
    }

    return points;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return [];
  }
}

export async function getActualMelbourneWeather() {
  try {
    // Melbourne CBD coordinates
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: -37.8136,
        lon: 144.9631,
        appid: API_KEY,
        units: 'metric'
      }
    });

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching Melbourne weather:', error);
    throw error;
  }
}
*/
