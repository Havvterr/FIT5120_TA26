<template>
  <div class="heat-map-container">
    <h1 class="page-title">Melbourne Heat Island Map</h1>
    <p class="page-description">
      This interactive map displays two key environmental indicators for Melbourne:
      <strong>Urban Heat Island Index</strong> and <strong>Vegetation Coverage</strong>, along with
      <strong>Real-time Temperature Data</strong>. Data is regularly updated through OpenWeatherMap
      to help you better understand the city's environmental conditions.
    </p>

    <div class="map-container">
      <div id="map" class="map-area"></div>
      <div v-if="!isDataLoaded" class="map-loading-overlay">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading temperature data...</p>
        </div>
      </div>

      <!-- Layer Controls -->
      <div class="map-layer-controls">
        <h3>Map Layers</h3>
        <div class="layer-buttons">
          <button :class="{ active: activeLayer === 'uhi' }" @click="switchLayer('uhi')">
            UHI Index
          </button>
          <button
            :class="{ active: activeLayer === 'vegetation' }"
            @click="switchLayer('vegetation')"
          >
            Vegetation Coverage
          </button>
        </div>
        <div class="layer-legend" v-if="activeLayer === 'vegetation'">
          <h4>Vegetation Coverage</h4>
          <div class="legend-item">
            <span class="color-box" style="background-color: #003300"></span>
            <span>80-100%</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #006600"></span>
            <span>60-80%</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #009900"></span>
            <span>40-60%</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #66cc00"></span>
            <span>20-40%</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #ccff99"></span>
            <span>0-20%</span>
          </div>
        </div>
        <div class="layer-legend" v-if="activeLayer === 'uhi'">
          <h4>UHI Index</h4>
          <div class="legend-item">
            <span class="color-box" style="background-color: #b10026"></span>
            <span>Very High (8+)</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #e31a1c"></span>
            <span>High (6-8)</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #fc4e2a"></span>
            <span>Moderate (4-6)</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #fd8d3c"></span>
            <span>Low (2-4)</span>
          </div>
          <div class="legend-item">
            <span class="color-box" style="background-color: #fed976"></span>
            <span>Very Low (0-2)</span>
          </div>
        </div>
      </div>

      <div class="map-overlay">
        <h3>Current Temperature</h3>
        <div v-if="currentWeather" class="current-weather">
          <div class="weather-main">
            <span class="temp">{{ currentWeather.temperature }}°C</span>
            <img
              :src="`http://openweathermap.org/img/w/${currentWeather.icon}.png`"
              :alt="currentWeather.description"
            />
          </div>
          <p class="weather-desc">{{ currentWeather.description }}</p>
          <p class="humidity">Humidity: {{ currentWeather.humidity }}%</p>
        </div>
        <div v-else class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading temperature data...</p>
        </div>
      </div>
    </div>

    <div class="data-section">
      <h2>Heat Island Effect Data Analysis</h2>

      <div class="data-cards">
        <div class="data-card">
          <h3>CBD Temperature Difference</h3>
          <div class="data-value">+7°C</div>
          <p>Maximum temperature difference between Melbourne CBD and surrounding suburbs</p>
        </div>

        <div class="data-card">
          <h3>Heat Island Area</h3>
          <div class="data-value">37 km²</div>
          <p>Coverage area of Melbourne's main heat island effect</p>
        </div>

        <div class="data-card">
          <h3>Annual Growth</h3>
          <div class="data-value">0.3°C</div>
          <p>Annual temperature increase of Melbourne's heat island effect</p>
        </div>
      </div>

      <div class="temperature-chart">
        <h3>Temperature Comparison of Melbourne Areas (Summer Average)</h3>
        <div class="chart-container">
          <div class="chart-bar" style="height: 90%">
            <span class="bar-label">CBD</span>
            <span class="temperature">32.5°C</span>
          </div>
          <div class="chart-bar" style="height: 80%">
            <span class="bar-label">Inner City</span>
            <span class="temperature">30.2°C</span>
          </div>
          <div class="chart-bar" style="height: 70%">
            <span class="bar-label">Middle Suburbs</span>
            <span class="temperature">28.7°C</span>
          </div>
          <div class="chart-bar" style="height: 60%">
            <span class="bar-label">Outer Suburbs</span>
            <span class="temperature">27.1°C</span>
          </div>
          <div class="chart-bar" style="height: 50%">
            <span class="bar-label">Rural Areas</span>
            <span class="temperature">25.8°C</span>
          </div>
        </div>
      </div>
    </div>

    <div class="factors-section">
      <h2>Factors Affecting Heat Island Effect</h2>
      <div class="factors-grid">
        <div class="factor-card">
          <h3>Building Density</h3>
          <p>High-density building areas accumulate more heat and dissipate it more slowly</p>
        </div>
        <div class="factor-card">
          <h3>Green Coverage</h3>
          <p>Trees and vegetation can reduce surrounding temperatures through transpiration</p>
        </div>
        <div class="factor-card">
          <h3>Surface Materials</h3>
          <p>Materials like asphalt and concrete absorb and store large amounts of heat</p>
        </div>
        <div class="factor-card">
          <h3>Human Activities</h3>
          <p>Transportation, industry, and air conditioning generate additional heat</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { getMelbourneTemperatures, getCurrentMelbourneWeather } from '../services/weatherService'

const currentWeather = ref(null)
const isDataLoaded = ref(false)
const activeLayer = ref('uhi')
let map = null
let vegetationLayer = null
let uhiLayer = null
let tempMarkers = []

// Clean up function to remove map and layers
function cleanup() {
  if (vegetationLayer) {
    vegetationLayer.remove()
    vegetationLayer = null
  }
  if (uhiLayer) {
    uhiLayer.remove()
    uhiLayer = null
  }
  if (tempMarkers && tempMarkers.length > 0) {
    tempMarkers.forEach((marker) => {
      if (marker) marker.remove()
    })
    tempMarkers = []
  }
  if (map) {
    map.remove()
    map = null
  }
}

// Function to switch between layers
function switchLayer(layerName) {
  activeLayer.value = layerName

  // Hide all layers first
  if (vegetationLayer) vegetationLayer.remove()
  if (uhiLayer) uhiLayer.remove()

  // Show the selected layer
  if (layerName === 'vegetation' && vegetationLayer) {
    vegetationLayer.addTo(map)
  } else if (layerName === 'uhi' && uhiLayer) {
    uhiLayer.addTo(map)
  }

  // Always show temperature markers regardless of layer
  addTemperatureMarkers()
}

// Function to load and setup vegetation coverage layer
async function loadVegetationLayer() {
  try {
    const response = await fetch('/data/heat-veg.geojson')
    const data = await response.json()

    vegetationLayer = L.geoJSON(data, {
      style: function (feature) {
        // Get vegetation coverage percentage
        const vegCoverage = feature.properties.PERANYVEG || 0

        // Determine color based on vegetation coverage
        let color
        if (vegCoverage >= 80) {
          color = '#003300' // Dark green for high vegetation
        } else if (vegCoverage >= 60) {
          color = '#006600'
        } else if (vegCoverage >= 40) {
          color = '#009900'
        } else if (vegCoverage >= 20) {
          color = '#66cc00'
        } else {
          color = '#ccff99' // Light green for low vegetation
        }

        return {
          fillColor: color,
          weight: 1,
          opacity: 0.7,
          color: '#666',
          fillOpacity: 0.7,
        }
      },
      onEachFeature: function (feature, layer) {
        // Add popup with information
        if (feature.properties) {
          layer.bindPopup(`
            <div class="custom-popup">
              <h3>Vegetation Data</h3>
              <p><strong>Vegetation Coverage:</strong> ${feature.properties.PERANYVEG || 0}%</p>
              <p><strong>Area:</strong> ${feature.properties.SHAPE_AREA ? (feature.properties.SHAPE_AREA / 10000).toFixed(2) : 0} ha</p>
            </div>
          `)
        }
      },
    })

    if (activeLayer.value === 'vegetation') {
      vegetationLayer.addTo(map)
    }
  } catch (error) {
    console.error('Error loading vegetation data:', error)
  }
}

// Function to load and setup UHI layer
async function loadUHILayer() {
  try {
    const response = await fetch('/data/heat-veg.geojson')
    const data = await response.json()

    uhiLayer = L.geoJSON(data, {
      style: function (feature) {
        // Get UHI index
        const uhiIndex = feature.properties.UHI18_M || 0

        // Determine color based on UHI index
        let color
        if (uhiIndex >= 8) {
          color = '#b10026' // Dark red for high UHI
        } else if (uhiIndex >= 6) {
          color = '#e31a1c'
        } else if (uhiIndex >= 4) {
          color = '#fc4e2a'
        } else if (uhiIndex >= 2) {
          color = '#fd8d3c'
        } else {
          color = '#fed976' // Yellow for low UHI
        }

        return {
          fillColor: color,
          weight: 1,
          opacity: 0.7,
          color: '#666',
          fillOpacity: 0.7,
        }
      },
      onEachFeature: function (feature, layer) {
        // Add popup with information
        if (feature.properties) {
          layer.bindPopup(`
            <div class="custom-popup">
              <h3>Urban Heat Island Data</h3>
              <p><strong>UHI Index:</strong> ${feature.properties.UHI18_M || 0}</p>
              <p><strong>Area:</strong> ${feature.properties.SHAPE_AREA ? (feature.properties.SHAPE_AREA / 10000).toFixed(2) : 0} ha</p>
            </div>
          `)
        }
      },
    })

    if (activeLayer.value === 'uhi') {
      uhiLayer.addTo(map)
    }
  } catch (error) {
    console.error('Error loading UHI data:', error)
  }
}

// Function to add temperature markers
function addTemperatureMarkers() {
  getMelbourneTemperatures()
    .then((points) => {
      // Clear existing markers
      if (tempMarkers.length > 0) {
        tempMarkers.forEach((marker) => {
          if (marker) marker.remove()
        })
      }
      tempMarkers = []

      // Filter out the specified suburbs
      const filteredPoints = points.filter((point) => {
        // Filter out Kensington, Docklands, Fitzroy, South Melbourne, and Footscray points
        return !(
          (point.name && point.name.includes('Kensington')) ||
          (point.name && point.name.includes('Docklands')) ||
          (point.name && point.name.includes('Fitzroy')) ||
          (point.name && point.name.includes('South Melbourne')) ||
          (point.name && point.name.includes('Footscray'))
        )
      })

      // Add temperature markers with popups
      filteredPoints.forEach((point) => {
        // Determine color based on temperature
        let markerColor
        if (point.value < 12) {
          markerColor = '#003296' // Cold
        } else if (point.value < 14) {
          markerColor = '#1e5ab4' // Cool
        } else if (point.value < 16) {
          markerColor = '#3c82d2' // Mild
        } else if (point.value < 18) {
          markerColor = '#78a0e6' // Moderate
        } else {
          markerColor = '#aac8f0' // Warm
        }

        // Create a custom icon with highlight effect
        const customIcon = L.divIcon({
          className: 'custom-temp-marker',
          html: `
          <div class="marker-pulse" style="box-shadow: 0 0 0 ${markerColor}"></div>
          <div class="temp-value" style="background-color: ${markerColor}">${Math.round(point.value)}°</div>
        `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })

        // Create marker with custom icon
        const marker = L.marker([point.lat, point.lng], { icon: customIcon })
          .bindPopup(
            `
          <div class="temp-popup">
            <h3>${point.name || 'Location'}</h3>
            <div class="temp-large" style="color: ${markerColor}">${point.value.toFixed(1)}°C</div>
            <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
          </div>
        `,
            { className: 'temp-popup-container' },
          )
          .addTo(map)

        tempMarkers.push(marker)
      })
    })
    .catch((error) => {
      console.error('Error loading temperature markers:', error)
    })
}

async function initMap() {
  // Clean up existing instances
  cleanup()
  isDataLoaded.value = false

  // Create map instance
  map = L.map('map').setView([-37.8136, 144.9631], 11)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map)

  try {
    // Get current weather for Melbourne CBD
    currentWeather.value = await getCurrentMelbourneWeather()

    // Load vegetation and UHI layers
    await loadVegetationLayer()
    await loadUHILayer()

    // Add temperature markers
    addTemperatureMarkers()

    isDataLoaded.value = true
  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.heat-map-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Layer control styles */
.map-layer-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 200px;
}

.map-layer-controls h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.layer-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer-buttons button {
  padding: 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layer-buttons button.active {
  background-color: #014421;
  color: white;
  border-color: #014421;
}

.layer-buttons button:hover:not(.active) {
  background-color: #e0e0e0;
}

.layer-legend {
  margin-top: 1rem;
}

.layer-legend h4 {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
}

.color-box {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

/* Custom marker styles */
:deep(.custom-temp-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-pulse) {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 0 rgba(255, 255, 255, 0.6);
  animation: pulse 2s infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.temp-value) {
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 36px;
  border-radius: 50%;
  background-color: #ff4500;
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Custom popup styles */
:deep(.custom-popup) {
  padding: 5px;
}

:deep(.custom-popup h3) {
  margin: 0 0 10px 0;
  font-size: 16px;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }

  70% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }

  100% {
    transform: translate(-50%, -50%) scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

/* Custom popup styles */
:deep(.temp-popup-container) {
  min-width: 200px;
}

:deep(.temp-popup) {
  text-align: center;
  padding: 5px;
}

:deep(.temp-popup h3) {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

:deep(.temp-large) {
  font-size: 24px;
  font-weight: bold;
  color: #ff4500;
  margin: 10px 0;
}

.page-title {
  color: var(--color-heading);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.page-description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: var(--color-text);
  line-height: 1.6;
}

.map-container {
  position: relative;
  width: 100%;
  height: 600px;
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-area {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.current-weather {
  margin: 1rem 0;
  text-align: center;
}

.weather-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.temp {
  font-size: 2rem;
  font-weight: bold;
  color: #014421;
}

.weather-desc {
  margin: 0.5rem 0;
  text-transform: capitalize;
}

.humidity {
  font-size: 0.9rem;
  color: #666;
}

.data-section {
  margin-bottom: 3rem;
  margin-top: 4rem;
}

.data-section h2 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
}

.data-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.data-card {
  flex: 1;
  min-width: 250px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.data-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.data-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--vt-c-green);
  margin-bottom: 0.5rem;
}

.temperature-chart {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  padding-bottom: 3rem;
  margin-top: 5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.temperature-chart h3 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

.chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 350px;
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.chart-bar {
  width: 18%;
  background: linear-gradient(to top, #81c784, #2e7d32);
  border-radius: 8px 8px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 1rem;
  transition: height 0.5s ease;
}

.bar-label {
  position: absolute;
  bottom: -30px;
  color: var(--color-text);
  font-weight: 500;
  width: 100%;
  text-align: center;
  white-space: nowrap;
}

.temperature {
  color: white;
  font-weight: bold;
}

.factors-section {
  margin-bottom: 3rem;
  margin-top: 4rem;
}

.factors-section h2 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.factor-card {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.factor-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #014421;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.map-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

@media (max-width: 768px) {
  .map-container {
    height: 400px;
  }

  .map-overlay {
    top: 10px;
    right: 10px;
    padding: 1rem;
  }

  .map-layer-controls {
    top: 10px;
    left: 10px;
    padding: 0.5rem;
  }

  .layer-buttons button {
    padding: 0.3rem;
    font-size: 0.8rem;
  }

  .temp {
    font-size: 1.5rem;
  }

  .data-cards {
    flex-direction: column;
  }

  .chart-container {
    height: 300px;
    margin-bottom: 2.5rem;
  }

  .chart-bar {
    width: 15%;
  }

  .bar-label {
    font-size: 0.8rem;
  }

  .temperature {
    font-size: 0.9rem;
  }
}
</style>
