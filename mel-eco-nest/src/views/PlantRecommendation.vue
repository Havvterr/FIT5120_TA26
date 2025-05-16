<script setup>
import { ref, onMounted } from 'vue'
import { plantService } from '../services/plantService'
import { useRouter } from 'vue-router'

const router = useRouter()
const sunlight = ref('')
const waterNeeds = ref('')
const maintenanceLevel = ref('')
const showRecommendations = ref(false)
const recommendations = ref([])
const loading = ref(false)
const error = ref(null)
const selectedPlants = ref([])

// 保存状态到 localStorage
const saveState = () => {
  const state = {
    sunlight: sunlight.value,
    waterNeeds: waterNeeds.value,
    maintenanceLevel: maintenanceLevel.value,
    showRecommendations: showRecommendations.value,
    recommendations: recommendations.value,
    selectedPlants: selectedPlants.value
  }
  localStorage.setItem('plantRecommendationState', JSON.stringify(state))
}

// 从 localStorage 恢复状态
const restoreState = () => {
  const savedState = localStorage.getItem('plantRecommendationState')
  if (savedState) {
    const state = JSON.parse(savedState)
    sunlight.value = state.sunlight
    waterNeeds.value = state.waterNeeds
    maintenanceLevel.value = state.maintenanceLevel
    showRecommendations.value = state.showRecommendations
    recommendations.value = state.recommendations
    selectedPlants.value = state.selectedPlants
  }
}

// 清除保存的状态
const clearState = () => {
  localStorage.removeItem('plantRecommendationState')
}

const resetForm = () => {
  sunlight.value = ''
  waterNeeds.value = ''
  maintenanceLevel.value = ''
  showRecommendations.value = false
  recommendations.value = []
  error.value = null
  selectedPlants.value = []
  clearState()
}

const togglePlantSelection = (plantName) => {
  const idx = selectedPlants.value.indexOf(plantName)
  if (idx > -1) {
    selectedPlants.value.splice(idx, 1)
  } else if (selectedPlants.value.length < 3) {
    selectedPlants.value.push(plantName)
  }
}

const isPlantSelected = (plantName) => selectedPlants.value.includes(plantName)

const createPlan = () => {
  console.log('Creating plan for plants:', selectedPlants.value)
  router.push({
    name: 'waterReminder',
    query: { plants: selectedPlants.value.join(',') }
  }).catch(err => {
    console.error('Navigation failed:', err)
  })
}

const sunlightOptions = [
  {
    value: 'Full Sun',
    icon: '☀️',
    description: 'Full Sun',
    detail: '6+ hours of sunlight daily',
  },
  {
    value: 'Partial Shade',
    icon: '🌤️',
    description: 'Partial Shade',
    detail: '3-6 hours of sunlight',
  },
  {
    value: 'Shade',
    icon: '🌥️',
    description: 'Shade',
    detail: 'Less than 3 hours',
  },
]

const waterNeedsOptions = [
  { value: 'Low', icon: '💧', description: 'Low Water Needs', detail: 'Water once a week or less' },
  {
    value: 'Medium',
    icon: '💧💧',
    description: 'Medium',
    detail: 'Water 2-3 times a week',
  },
  { value: 'High', icon: '💧💧💧', description: 'High', detail: 'Water daily or more' },
]

const maintenanceLevelOptions = [
  { value: 'Low', icon: '🌱', description: 'Low Maintenance', detail: 'Perfect for beginners' },
  {
    value: 'Medium',
    icon: '🌿',
    description: 'Medium Maintenance',
    detail: 'Requires regular attention',
  },
  { value: 'High', icon: '🌺', description: 'High Maintenance', detail: 'Needs careful attention' },
]

const getRecommendations = async () => {
  if (!sunlight.value || !waterNeeds.value || !maintenanceLevel.value) {
    error.value = 'Please fill in all fields'
    return
  }

  loading.value = true
  error.value = null

  try {
    const userPreferences = {
      sunlight: sunlight.value,
      waterNeeds: waterNeeds.value,
      maintenanceLevel: maintenanceLevel.value,
    }

    recommendations.value = await plantService.getRecommendations(userPreferences)
    recommendations.value = recommendations.value.map(plant => ({
      ...plant,
      showGuide: false
    }))
    showRecommendations.value = true
    // 保存状态
    saveState()
  } catch (e) {
    error.value = 'Failed to get plant recommendations. Please try again later.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 在组件挂载时恢复状态
onMounted(() => {
  restoreState()
})
</script>

<template>
  <div class="plant-recommendation">
    <div class="welcome-section">
      <h1>Find Your Perfect Plant</h1>
      <p class="welcome-text">
        Tell us about your gardening preferences, and we'll help you discover the perfect plants for
        your space.
      </p>
    </div>

    <div class="recommendation-form">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="form-group">
        <label>Select Sunlight Condition:</label>
        <div class="option-grid">
          <div
            v-for="option in sunlightOptions"
            :key="option.value"
            class="option-card"
            :class="{ selected: sunlight === option.value }"
            @click="sunlight = option.value"
          >
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-content">
              <h3>{{ option.description }}</h3>
              <p class="detail">{{ option.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Select Water Needs:</label>
        <div class="option-grid">
          <div
            v-for="option in waterNeedsOptions"
            :key="option.value"
            class="option-card"
            :class="{ selected: waterNeeds === option.value }"
            @click="waterNeeds = option.value"
          >
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-content">
              <h3>{{ option.description }}</h3>
              <p class="detail">{{ option.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Select Maintenance Level:</label>
        <div class="option-grid">
          <div
            v-for="option in maintenanceLevelOptions"
            :key="option.value"
            class="option-card"
            :class="{ selected: maintenanceLevel === option.value }"
            @click="maintenanceLevel = option.value"
          >
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-content">
              <h3>{{ option.description }}</h3>
              <p class="detail">{{ option.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        class="submit-button"
        @click="getRecommendations"
        :disabled="!sunlight || !waterNeeds || !maintenanceLevel || loading"
      >
        <span v-if="loading">Loading...</span>
        <span v-else>Get Recommendations</span>
      </button>
    </div>

    <div v-if="showRecommendations" class="recommendations">
      <h2>Your Plant Recommendations</h2>
      <div v-if="recommendations.length > 0" class="recommendation-list">
        <div class="plant-card" v-for="plant in recommendations" :key="plant.name">
          <div class="plant-image" v-if="plant.image_url">
            <img :src="plant.image_url" :alt="plant.name" @error="handleImageError" />
          </div>
          <div class="plant-info">
            <h3>{{ plant.name }}</h3>
            <p class="plant-species">{{ plant.species }}</p>
            <p class="plant-description">{{ plant.description }}</p>
            <div class="plant-selection">
              <button
                :class="['plant-select-btn', { selected: isPlantSelected(plant.name) }]"
                :disabled="!isPlantSelected(plant.name) && selectedPlants.length >= 3"
                @click="togglePlantSelection(plant.name)"
              >
                {{ isPlantSelected(plant.name) ? 'Selected' : 'Plant This' }}
              </button>
              <div class="tooltip-container">
                <button
                  class="guide-btn"
                  @mouseenter="plant.showGuide = true"
                  @mouseleave="plant.showGuide = false"
                  @click="router.push({
                    name: 'planting-guide',
                    query: {
                      plant: plant.name,
                      soil: plant.soil_type,
                      temperature: plant.temperature_range,
                      water: plant.water_needs,
                      sunlight: plant.sunlight_needs,
                      description: plant.description,
                      species: plant.species,
                      image: plant.image_url
                    }
                  })"
                >
                  Planting Guide
                </button>
                <div class="tooltip" v-if="plant.showGuide">
                  <h4>Plant Care Info</h4>
                  <div class="plant-care-info">
                    <p><strong>Soil:</strong> {{ plant.soil_type }}</p>
                    <p><strong>Temperature:</strong> {{ plant.temperature_range }}</p>
                    <p><strong>Water:</strong> {{ plant.water_needs }}</p>
                    <p><strong>Sunlight:</strong> {{ plant.sunlight_needs }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="recommendations.length > 0 && selectedPlants.length > 0" class="create-plan-section">
        <button
          class="create-plan-button"
          @click="createPlan"
        >
          Create planting plan ({{ selectedPlants.length }} plants selected)
        </button>
      </div>
      <p v-else-if="recommendations.length === 0" class="no-results">
        Sorry, no plants match your criteria. Try adjusting your preferences.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleImageError(e) {
      e.target.src = '/path/to/placeholder-image.jpg'
    },
  },
}
</script>

<style scoped>
.plant-recommendation {
  max-width: 1170px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #1a2a3a;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 4rem;
}

.welcome-text {
  color: #444;
  font-size: 1.3rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.recommendation-form {
  background-color: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin-bottom: 3rem;
}

.form-group {
  margin-bottom: 3rem;
}

label {
  display: block;
  margin-bottom: 1.5rem;
  color: #1a2a3a;
  font-size: 1.3rem;
  font-weight: 600;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.option-card {
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.option-card:hover {
  border-color: #33a06f;
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.option-card.selected {
  border-color: #33a06f;
  background-color: #e6f7f0;
}

.option-icon {
  font-size: 1.5rem;
}

.option-content h3 {
  margin: 0 0 0.7rem 0;
  color: #1a2a3a;
  font-size: 1.3rem;
}

.option-content .detail {
  margin: 0;
  color: #555;
  font-size: 1.1rem;
}

.submit-button {
  background-color: #d06a21;
  color: white;
  border: none;
  padding: 1.2rem 2.5rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  font-size: 1.3rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 2.5rem;
  position: relative;
}

.submit-button:hover:not(:disabled) {
  background-color: #034c26;
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.recommendations {
  margin-top: 3rem;
  padding: 3rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.recommendations h2 {
  font-size: 2.2rem;
  color: #1a2a3a;
  margin-bottom: 2.5rem;
  text-align: center;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  margin-top: 2.5rem;
}

.plant-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.plant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.plant-image {
  width: 100%;
  padding-top: 60%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.plant-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.plant-info h3 {
  color: #1a2a3a;
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.plant-species {
  color: #33a06f;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.plant-details {
  margin: 1.5rem 0;
}

.plant-details p {
  margin: 0.8rem 0;
  color: #444;
  font-size: 1.1rem;
  line-height: 1.5;
}

.detail-label {
  font-weight: 600;
  color: #1a2a3a;
}

.plant-description {
  color: #444;
  line-height: 1.5;
  font-size: 1rem;
  margin: 1rem 0;
}

.plant-selection {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.plant-selection button {
  background-color: #33a06f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  min-width: 120px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plant-selection .guide-btn {
  background-color: #4a90e2;
  flex: none;
}

.plant-selection .guide-btn:hover {
  background-color: #357abd;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.tooltip-container:hover .tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-3px);
}

.tooltip h4 {
  margin: 0 0 0.8rem 0;
  color: #33a06f;
  font-size: 1rem;
  text-align: center;
}

.plant-care-info {
  display: grid;
  gap: 0.5rem;
}

.plant-care-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plant-care-info strong {
  color: #33a06f;
  font-weight: 500;
  margin-right: 0.5rem;
}

.plant-selection button.selected {
  background-color: #034c26;
}

.plant-selection button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.create-plan-section {
  margin-top: 2rem;
  text-align: center;
}

.create-plan-button {
  background-color: #33a06f;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-plan-button:hover {
  background-color: #2a855d;
  transform: translateY(-2px);
}
</style>
