<script setup>
import { ref, onMounted } from 'vue'
import { plantService } from '../services/plantService'

const sunlight = ref('')
const waterNeeds = ref('')
const maintenanceLevel = ref('')
const showRecommendations = ref(false)
const recommendations = ref([])
const loading = ref(false)
const error = ref(null)

const resetForm = () => {
  sunlight.value = ''
  waterNeeds.value = ''
  maintenanceLevel.value = ''
  showRecommendations.value = false
  recommendations.value = []
  error.value = null
}
const sunlightOptions = [
  { value: 'Full Sun', icon: '☀️', description: 'Full Sun', detail: '6+ hours of direct sunlight daily' },
  { value: 'Partial Shade', icon: '🌤️', description: 'Partial Shade', detail: '3-6 hours of direct sunlight' },
  { value: 'Shade', icon: '🌥️', description: 'Shade', detail: 'Less than 3 hours of direct sunlight' }
]

const waterNeedsOptions = [
  { value: 'Low', icon: '💧', description: 'Low Water Needs', detail: 'Water once a week or less' },
  { value: 'Medium', icon: '💧💧', description: 'Medium Water Needs', detail: 'Water 2-3 times a week' },
  { value: 'High', icon: '💧💧💧', description: 'High Water Needs', detail: 'Water daily or more' }
]

const maintenanceLevelOptions = [
  { value: 'Low', icon: '🌱', description: 'Low Maintenance', detail: 'Perfect for beginners' },
  { value: 'Medium', icon: '🌿', description: 'Medium Maintenance', detail: 'Requires regular attention' },
  { value: 'High', icon: '🌺', description: 'High Maintenance', detail: 'Needs careful attention' }
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
      maintenanceLevel: maintenanceLevel.value
    }

    recommendations.value = await plantService.getRecommendations(userPreferences)
    showRecommendations.value = true
  } catch (e) {
    error.value = 'Failed to get plant recommendations. Please try again later.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="plant-recommendation">
    <div class="welcome-section">
      <h1>Find Your Perfect Plant</h1>
      <p class="welcome-text">Tell us about your gardening preferences, and we'll help you discover the perfect plants for your space.</p>
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
            :class="{ 'selected': sunlight === option.value }"
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
            :class="{ 'selected': waterNeeds === option.value }"
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
            :class="{ 'selected': maintenanceLevel === option.value }"
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
            <img :src="plant.image_url" :alt="plant.name" @error="handleImageError">
          </div>
          <div class="plant-info">
            <h3>{{ plant.name }}</h3>
            <p class="plant-species">{{ plant.species }}</p>
            <div class="plant-details">
              <p><span class="detail-label">Sunlight:</span> {{ plant.sunlight_needs }}</p>
              <p><span class="detail-label">Water Needs:</span> {{ plant.water_needs }}</p>
              <p><span class="detail-label">Temperature:</span> {{ plant.temperature_range }}</p>
              <p><span class="detail-label">Maintenance:</span> {{ plant.maintenance_level }}</p>
            </div>
            <p class="plant-description">{{ plant.description }}</p>
            <div class="match-score">

            </div>
          </div>
        </div>
      </div>
      <p v-else class="no-results">Sorry, no plants match your criteria. Try adjusting your preferences.</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleImageError(e) {
      e.target.src = '/path/to/placeholder-image.jpg';
    }
  }
}
</script>

<style scoped>
.plant-recommendation {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-text {
  color: #666;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.recommendation-form {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-group {
  margin-bottom: 2rem;
}

label {
  display: block;
  margin-bottom: 1rem;
  color: #2c3e50;
  font-size: 1.1rem;
}

.balcony-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.balcony-option {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.balcony-option:hover {
  border-color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.balcony-option.selected {
  border-color: #42b983;
  background-color: #f0faf5;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.option-card {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.option-card:hover {
  border-color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border-color: #42b983;
  background-color: #f0faf5;
}
.option-content h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.option-content .description {
  margin: 0 0 0.25rem 0;
  color: #666;
}

.option-content .detail {
  margin: 0;
  color: #888;
  font-size: 0.9rem;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 2rem;
  position: relative;
}

.submit-button:hover:not(:disabled) {
  background-color: #3aa876;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.recommendations {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.plant-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.plant-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.plant-image {
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.plant-card h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
}

.plant-card p {
  margin: 0.5rem 0;
  color: #666;
}
.plant-image {
  width: 100%;
  padding-top: 75%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.plant-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.plant-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.plant-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
