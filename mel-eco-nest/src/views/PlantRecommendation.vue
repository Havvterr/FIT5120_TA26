<script setup>
import { ref } from 'vue'

const balconyArea = ref('')
const wateringFrequency = ref('')
const plantingSeason = ref('')
const showRecommendations = ref(false)
const recommendations = ref([])

const balconyOptions = [
  { value: 2, label: 'Small Balcony', description: 'Space for a small coffee table', icon: '🪑', detail: 'About 2 square meters, suitable for 2-4 small potted plants' },
  { value: 4, label: 'Medium Balcony', description: 'Space for a double bed', icon: '🛏️', detail: 'About 4 square meters, suitable for 5-8 medium-sized potted plants' },
  { value: 8, label: 'Large Balcony', description: 'Space of a small bedroom', icon: '🏠', detail: 'About 8 square meters, suitable for creating a small sky garden' }
]

const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']
const frequencies = [
  { value: 1, label: 'Once per week' },
  { value: 2, label: 'Twice per week' },
  { value: 3, label: 'Three times per week' },
  { value: 4, label: 'Four times or more per week' }
]

const plantDatabase = [
  {
    name: 'Succulent',
    minArea: 0.1,
    maxArea: 2,
    wateringFrequency: 1,
    seasons: ['Spring', 'Summer', 'Autumn']
  },
  {
    name: 'Lavender',
    minArea: 0.5,
    maxArea: 3,
    wateringFrequency: 2,
    seasons: ['Spring', 'Summer']
  },
  {
    name: 'Rosemary',
    minArea: 0.3,
    maxArea: 2,
    wateringFrequency: 2,
    seasons: ['Spring', 'Summer', 'Autumn']
  },
  {
    name: 'Pothos',
    minArea: 0.2,
    maxArea: 1.5,
    wateringFrequency: 3,
    seasons: ['Spring', 'Summer', 'Autumn', 'Winter']
  }
]

const getRecommendations = () => {
  const area = parseFloat(balconyArea.value)
  const frequency = parseInt(wateringFrequency.value)
  const season = plantingSeason.value

  recommendations.value = plantDatabase.filter(plant => {
    return (
      area >= plant.minArea &&
      area <= plant.maxArea &&
      frequency >= plant.wateringFrequency &&
      plant.seasons.includes(season)
    )
  })

  showRecommendations.value = true
}
</script>

<template>
  <div class="plant-recommendation">
    <h1>Balcony Plant Recommendations</h1>
    <div class="recommendation-form">
      <div class="form-group">
        <label>Select Your Balcony Size:</label>
        <div class="balcony-options">
          <div
            v-for="option in balconyOptions"
            :key="option.value"
            class="balcony-option"
            :class="{ 'selected': balconyArea === option.value.toString() }"
            @click="balconyArea = option.value.toString()"
          >
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-content">
              <h3>{{ option.label }}</h3>
              <p class="description">{{ option.description }}</p>
              <p class="detail">{{ option.detail }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="wateringFrequency">Watering Frequency:</label>
        <select id="wateringFrequency" v-model="wateringFrequency" required>
          <option value="">Please select watering frequency</option>
          <option
            v-for="freq in frequencies"
            :key="freq.value"
            :value="freq.value"
          >
            {{ freq.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="plantingSeason">Planting Season:</label>
        <select id="plantingSeason" v-model="plantingSeason" required>
          <option value="">Please select season</option>
          <option v-for="season in seasons" :key="season" :value="season">
            {{ season }}
          </option>
        </select>
      </div>

      <button @click="getRecommendations" class="submit-button">
        Get Plant Recommendations
      </button>
    </div>

    <div v-if="showRecommendations" class="recommendations">
      <h2>Recommended Plants</h2>
      <div v-if="recommendations.length > 0" class="recommendation-list">
        <div
          v-for="plant in recommendations"
          :key="plant.name"
          class="plant-card"
        >
          <h3>{{ plant.name }}</h3>
          <p>Suitable Area: {{ plant.minArea }}-{{ plant.maxArea }} square meters</p>
          <p>Watering Suggestion: {{ plant.wateringFrequency }} times per week</p>
          <p>Suitable Seasons: {{ plant.seasons.join(', ') }}</p>
        </div>
      </div>
      <p v-else>Sorry, no plants match your criteria.</p>
    </div>
  </div>
</template>

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

.recommendation-form {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.option-icon {
  font-size: 2rem;
  line-height: 1;
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
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3aa876;
}

.recommendations {
  margin-top: 2rem;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.plant-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
</style>
