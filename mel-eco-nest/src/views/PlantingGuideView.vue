<template>
  <div class="planting-guide" @click="handlePageClick">
    <div class="page-header">
      <h1>Planting Guide</h1>
      <p class="subtitle">Find detailed planting instructions for your favorite plants</p>
    </div>

    <div class="search-container">
      <div class="search-wrapper">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            @click.stop="handleInputClick"
            placeholder="Enter plant name..."
            class="search-input"
          />
          <div v-if="showSuggestions && filteredPlants.length > 0" class="suggestions" @click.stop>
            <div
              v-for="plant in filteredPlants"
              :key="plant.plant_id"
              @click="selectPlant(plant)"
              class="suggestion-item"
              :style="{ color: '#034c26', fontWeight: '500' }"
            >
              {{ plant.name }}
            </div>
          </div>
        </div>
        <button @click="confirmSearch" class="confirm-button" :disabled="!searchQuery || isLoading">
          <span v-if="isLoading">Loading...</span>
          <span v-else>Confirm</span>
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="selectedPlant" class="plant-details">
      <div class="plant-header">
        <h2>{{ selectedPlant.name }}</h2>
        <span class="species">{{ selectedPlant.species }}</span>
      </div>

      <div class="plant-content">
        <div class="plant-image">
          <img :src="selectedPlant.image_url" :alt="selectedPlant.name" />
        </div>

        <div class="plant-info">
          <div class="info-section">
            <h3>Planting Guide</h3>
            <p>{{ selectedPlant.guide }}</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <h4>Maintenance Level</h4>
              <p>{{ selectedPlant.maintenance_level }}</p>
            </div>
            <div class="info-item">
              <h4>Size</h4>
              <p>{{ selectedPlant.size }}</p>
            </div>
            <div class="info-item">
              <h4>Soil Type</h4>
              <p>{{ selectedPlant.soil_type }}</p>
            </div>
            <div class="info-item">
              <h4>Sunlight Needs</h4>
              <p>{{ selectedPlant.sunlight_needs }}</p>
            </div>
            <div class="info-item">
              <h4>Temperature Range</h4>
              <p>{{ selectedPlant.temperature_range }}</p>
            </div>
            <div class="info-item">
              <h4>Water Needs</h4>
              <p>{{ selectedPlant.water_needs }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="welcome-section">
      <div class="welcome-content">
        <i class="fas fa-seedling welcome-icon"></i>
        <h2>Welcome to the Planting Guide</h2>
        <p>Search for a plant to get detailed planting instructions and care tips.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

export default {
  name: 'PlantingGuideView',
  setup() {
    const route = useRoute()
    const searchQuery = ref('')
    const plants = ref([])
    const filteredPlants = ref([])
    const selectedPlant = ref(null)
    const showSuggestions = ref(false)
    const isLoading = ref(false)
    const errorMessage = ref('')

    // Fetch all plants from the database
    const fetchPlants = async () => {
      try {
        const baseUrl = import.meta.env.MODE === 'development'
          ? 'http://localhost:3000/plants'
          : '/api/plants'
        const response = await axios.get(baseUrl)
        plants.value = response.data

        // 如果URL中有plant参数，自动搜索该植物
        const plantFromUrl = route.query.plant
        if (plantFromUrl) {
          searchQuery.value = plantFromUrl
          await confirmSearch()
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
        errorMessage.value = 'Failed to load plant data. Please try again later.'
      }
    }

    // Handle search input
    const handleSearch = () => {
      if (searchQuery.value.length > 0) {
        filteredPlants.value = plants.value.filter((plant) =>
          plant.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
        )
        showSuggestions.value = true
      } else {
        showSuggestions.value = false
        filteredPlants.value = []
      }
    }

    // Select a plant from suggestions
    const selectPlant = (plant) => {
      selectedPlant.value = plant
      searchQuery.value = plant.name
      showSuggestions.value = false
    }

    // Confirm search and fetch plant details
    const confirmSearch = async () => {
      if (!searchQuery.value) return

      isLoading.value = true
      errorMessage.value = ''

      try {
        // First try to find the plant in our local data
        const localPlant = plants.value.find(
          (plant) => plant.name.toLowerCase() === searchQuery.value.toLowerCase(),
        )

        if (localPlant) {
          selectedPlant.value = localPlant
        } else {
          // If not found locally, try to fetch from server
          const baseUrl = import.meta.env.MODE === 'development'
            ? 'http://localhost:3000/plants'
            : '/api/plants'
          const response = await axios.get(
            `${baseUrl}/${encodeURIComponent(searchQuery.value)}`
          )
          selectedPlant.value = response.data
        }
      } catch (error) {
        console.error('Error fetching plant details:', error)
        if (error.response && error.response.status === 404) {
          errorMessage.value = `Plant "${searchQuery.value}" not found. Please try another name.`
        } else {
          errorMessage.value = 'Failed to load plant details. Please try again later.'
        }
        selectedPlant.value = null
      } finally {
        isLoading.value = false
      }
    }

    const handlePageClick = () => {
      showSuggestions.value = false
    }

    const handleInputClick = () => {
      if (searchQuery.value.trim() !== '') {
        handleSearch()
      }
    }

    onMounted(() => {
      fetchPlants()
    })

    return {
      searchQuery,
      filteredPlants,
      selectedPlant,
      showSuggestions,
      isLoading,
      errorMessage,
      handleSearch,
      selectPlant,
      confirmSearch,
      handlePageClick,
      handleInputClick,
    }
  },
}
</script>

<style scoped>
.planting-guide {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #233240;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.subtitle {
  color: #5b5b5b;
  font-size: 1.2rem;
  margin-top: 0;
}

.search-container {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto 3rem;
}

.search-wrapper {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  border-color: #034c26;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}

.confirm-button {
  padding: 0.9rem 2.5rem;
  background-color: #429bbc;
  color: white;
  border: none;
  border-radius: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(30, 106, 147, 0.3);
  white-space: nowrap;
  height: 100%;
  min-height: 3.2rem;
}

.confirm-button:hover {
  background-color: #034c26;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
}

.confirm-button:disabled {
  background-color: #bfbfbf;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem auto;
  text-align: center;
  max-width: 600px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #034c26 !important;
  font-weight: 500 !important;
}

.suggestion-item:hover {
  background-color: #f0f7f3;
  color: #197948 !important;
}

.plant-details {
  margin-top: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.plant-header {
  padding: 1.5rem 2rem;
  background: #034c26;
  color: rgb(244, 238, 238);
}

.plant-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
}

.species {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  display: block;
  margin-top: 0.3rem;
}

.plant-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.plant-image {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.plant-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s;
}

.plant-image img:hover {
  transform: scale(1.03);
}

.plant-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.info-section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  background: #f8f9fa;
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.info-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
}

.info-item p {
  margin: 0;
  color: #666;
}

.welcome-section {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  padding: 3rem;
  background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.welcome-content {
  text-align: center;
  max-width: 600px;
}

.welcome-icon {
  font-size: 4rem;
  color: #034c26;
  margin-bottom: 1.5rem;
}

.welcome-content h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.welcome-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.welcome-content ul {
  text-align: left;
  display: inline-block;
  margin-top: 1rem;
}

.welcome-content li {
  margin-bottom: 0.5rem;
  color: #555;
}

@media (max-width: 768px) {
  .planting-guide {
    padding: 1.5rem;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .plant-content {
    padding: 1.5rem;
  }

  .plant-image {
    max-width: 100%;
  }

  .welcome-section {
    padding: 2rem 1.5rem;
  }
}
</style>
