<template>
  <div class="efficient-appliances-container">
    <!-- Static content section - not dependent on data loading -->
    <section class="static-content">
      <div class="banner-container">
        <div class="banner-overlay">
          <h1 class="banner-title">Efficient Appliances</h1>
          <p class="banner-description">
            Choose energy-efficient appliances to reduce energy consumption and carbon emissions
          </p>
        </div>
      </div>

      <div class="content-container">
        <div class="introduction">
          <h2>Benefits of Energy-Efficient Appliances</h2>
          <div class="benefits-grid">
            <div class="benefits-row">
              <div class="benefit-card">
                <i class="fas fa-dollar-sign benefit-icon"></i>
                <h3>Lower Energy Bills</h3>
                <p>
                  High-efficiency appliances can save 20-50% energy consumption, significantly
                  reducing long-term operating costs
                </p>
              </div>
              <div class="benefit-card">
                <i class="fas fa-leaf benefit-icon"></i>
                <h3>Reduce Carbon Footprint</h3>
                <p>
                  Using efficient appliances reduces greenhouse gas emissions and contributes to
                  environmental protection
                </p>
              </div>
            </div>
            <div class="benefits-row">
              <div class="benefit-card">
                <i class="fas fa-cog benefit-icon"></i>
                <h3>Extended Lifespan</h3>
                <p>
                  Energy-efficient appliances typically use advanced technology and better
                  materials, providing longer service life
                </p>
              </div>
              <div class="benefit-card">
                <i class="fas fa-home benefit-icon"></i>
                <h3>Improved Quality of Life</h3>
                <p>
                  Modern energy-efficient appliances often include smart features for better user
                  experience and convenience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dynamic content section - dependent on data loading -->
    <section class="dynamic-content">
      <div class="content-container">
        <div class="appliances-section">
          <div class="data-source-info">
            <div class="data-source-content">
              <i class="fas fa-info-circle data-source-icon"></i>
              <div>
                <p>
                  Product data sourced from
                  <a
                    href="https://www.energyrating.gov.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    >www.energyrating.gov.au</a
                  >, a joint initiative by the Australian Government, state and territory
                  governments, and the New Zealand Government.
                </p>
                <p>
                  Managed by the Department of Climate Change, Energy, the Environment and Water,
                  this platform promotes awareness of energy labels and minimum energy performance
                  standards (MEPS) to support energy efficiency and sustainability.
                </p>
              </div>
            </div>
          </div>

          <h2>Recommended Energy-Efficient Appliances</h2>

          <div class="filter-container">
            <div class="filter-title">Filter by Category:</div>
            <div class="category-filters">
              <button
                class="category-button"
                :class="{ active: selectedCategory === 'all' }"
                @click="selectCategory('all')"
              >
                All Appliances
              </button>
              <button
                v-for="category in categories"
                :key="category"
                class="category-button"
                :class="{ active: selectedCategory === category }"
                @click="selectCategory(category)"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <div class="appliances-grid">
            <div v-if="loading" class="loading-container">
              <div class="loading-spinner"></div>
              <p>Loading appliance data...</p>
            </div>

            <div v-else-if="errorMessage" class="error-container">
              <i class="fas fa-exclamation-triangle error-icon"></i>
              <p>{{ errorMessage }}</p>
              <button @click="retryFetchAppliances" class="retry-button">Retry</button>
            </div>

            <div v-else-if="filteredAppliances.length === 0" class="no-results">
              <i class="fas fa-search no-results-icon"></i>
              <p>No appliances found in category "{{ selectedCategory }}"</p>
              <button @click="selectCategory('all')" class="retry-button">Show All</button>
            </div>

            <div v-for="appliance in filteredAppliances" :key="appliance.id" class="appliance-card">
              <div class="appliance-image-container">
                <img :src="getImageUrl(appliance)" :alt="appliance.name" class="appliance-image" />
                <div class="energy-rating" :class="{ 'eco-certified': !appliance.energy_rating }">
                  <i v-if="appliance.energy_rating" class="energy-rating-text">{{
                    appliance.energy_rating
                  }}</i>
                  <i v-else class="fas fa-check energy-efficient-icon"></i>
                </div>
              </div>
              <div class="appliance-info">
                <h3 class="appliance-name">{{ appliance.name }}</h3>
                <p class="appliance-model">{{ appliance.model }}</p>
                <p class="appliance-price" v-if="appliance.price">
                  ¥{{ appliance.price.toLocaleString() }}
                </p>
                <p class="appliance-savings">
                  {{ appliance.energy_savings || 'Energy efficient' }}
                </p>
                <p class="appliance-description">{{ appliance.description }}</p>
                <div class="appliance-features" v-if="appliance.features">
                  <p class="features-title">Features:</p>
                  <ul class="features-list">
                    <li
                      v-for="(feature, index) in appliance.features
                        ? appliance.features.split(',')
                        : []"
                      :key="index"
                    >
                      {{ feature }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { ref, computed, onMounted, onBeforeMount, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'EfficientAppliancesView',
  setup() {
    const route = useRoute()
    const appliances = ref([])
    const loading = ref(false)
    const errorMessage = ref('')
    const selectedCategory = ref('all')
    const dataLoaded = ref(false)
    const fetchAttempts = ref(0)
    const maxFetchAttempts = 3
    const contentVisible = ref(true)

    // Normalize appliance data to handle different field naming conventions
    const normalizeApplianceData = (data) => {
      return data.map((item) => {
        // Create standard field names while preserving original data
        // Use nullish coalescing to handle missing fields
        return {
          ...item, // Keep all original fields
          // Map fields with standardized names for component use
          id: item.id,
          name: item.Brand ?? item.name ?? 'Unknown Brand',
          model: item.Model ?? item.model ?? 'Unknown Model',
          category: item.Category ?? item.category ?? 'Uncategorized',
          description: item.Description ?? item.description ?? '',
          image_url: item.img ?? item.image_url ?? null,
          // Handle new dataset specific fields - don't set N/A as default
          energy_rating: item.energy_rating || null,
          energy_savings: item.energy_savings ?? 'Energy efficient',
          features: item.features ?? '',
          price: item.price ?? undefined,
        }
      })
    }

    // Available appliance categories based on the database update
    const predefinedCategories = [
      'Air Conditioners',
      'Ballasts',
      'Clothes Dryers',
      'Clothes Washers',
      'Dish Washers',
    ]

    // Get all available categories
    const categories = computed(() => {
      // If data is empty, use predefined categories
      if (!appliances.value || appliances.value.length === 0) {
        return predefinedCategories
      }

      // Otherwise, extract unique categories from data
      const uniqueCategories = new Set(appliances.value.map((app) => app.category))
      return Array.from(uniqueCategories).sort()
    })

    // Filter appliances by selected category
    const filteredAppliances = computed(() => {
      if (selectedCategory.value === 'all') {
        return appliances.value
      }
      return appliances.value.filter((app) => app.category === selectedCategory.value)
    })

    // Fetch appliance data with force refresh option
    const fetchAppliances = async (forceRefresh = false) => {
      if (dataLoaded.value && appliances.value.length > 0 && !forceRefresh) {
        loading.value = false
        return
      }

      if (fetchAttempts.value >= maxFetchAttempts) {
        errorMessage.value = 'Unable to load data after multiple attempts. Please try again later.'
        loading.value = false
        contentVisible.value = true
        return
      }

      fetchAttempts.value += 1
      loading.value = true
      errorMessage.value = ''

      try {
        const baseUrl =
          import.meta.env.MODE === 'development'
            ? 'http://localhost:3000/api/appliances'
            : '/api/appliances'

        const response = await axios.get(baseUrl)

        // Validate data structure
        if (Array.isArray(response.data) && response.data.length > 0) {
          // Normalize data before storing
          appliances.value = normalizeApplianceData(response.data)
          dataLoaded.value = true
          fetchAttempts.value = 0 // Reset attempts on success
        } else {
          throw new Error('Invalid data format received from server')
        }
      } catch (error) {
        console.error('Error fetching appliances:', error)
        errorMessage.value = 'Unable to load appliance data. Please try again later.'

        // Try again after delay if not reached max attempts
        if (fetchAttempts.value < maxFetchAttempts) {
          setTimeout(() => {
            fetchAppliances(true)
          }, 2000) // Retry after 2 seconds
        }
      } finally {
        loading.value = false
        contentVisible.value = true
      }
    }

    // Retry button handler
    const retryFetchAppliances = () => {
      fetchAttempts.value = 0 // Reset attempts counter
      fetchAppliances(true) // Force refresh
    }

    // Select category
    const selectCategory = (category) => {
      selectedCategory.value = category
    }

    // Get image URL
    const getImageUrl = (appliance) => {
      // Check for image URL in standard or original field
      if (appliance.image_url && appliance.image_url.startsWith('http')) {
        return appliance.image_url
      }

      // Use default image if no image or invalid path
      return '/img/appliances/default.jpg'
    }

    // Watch for route changes to reload data if needed
    watch(
      () => route.fullPath,
      () => {
        // Force a reload when navigating to this page
        fetchAppliances(true)
      },
    )

    // Call fetchAppliances in both lifecycle hooks to ensure data loads
    onBeforeMount(() => {
      contentVisible.value = true
      setTimeout(() => {
        fetchAppliances(true)
      }, 100)
    })

    // Add a manual refresh method that can be called anywhere
    const refreshData = () => {
      return new Promise((resolve) => {
        fetchAppliances(true)
        nextTick(() => resolve())
      })
    }

    onMounted(() => {
      contentVisible.value = true
      setTimeout(() => {
        fetchAppliances(true)
      }, 100)

      document.addEventListener('DOMContentLoaded', () => {
        contentVisible.value = true
      })

      // Add event listener for page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          contentVisible.value = true
          refreshData()
        }
      })

      // Add window load event listener for reliable data loading
      window.addEventListener('load', () => {
        contentVisible.value = true
        refreshData()
      })
    })

    return {
      appliances,
      loading,
      errorMessage,
      categories,
      selectedCategory,
      filteredAppliances,
      fetchAppliances,
      retryFetchAppliances,
      selectCategory,
      getImageUrl,
      refreshData,
      contentVisible,
    }
  },
}
</script>

<style scoped>
/* Global styles */
.efficient-appliances-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.static-content,
.dynamic-content {
  width: 100%;
}

/* Ensure static content is always visible */
.static-content {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 500px;
  background-image: url('@/assets/E1.jpg');
  background-size: cover;
  background-position: center;
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 0 2rem;
}

.banner-title {
  font-size: 2.8rem;
  margin-bottom: 1.2rem;
  font-weight: bold;
  color: #ffffff;
}

.banner-description {
  font-size: 1.2rem;
  max-width: 800px;
}

.content-container {
  padding: 0;
  width: 100%;
  max-width: 100%;
}

.introduction {
  margin-top: 6rem;
  margin-bottom: 3rem;
  width: 100%;
}

.introduction h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.benefits-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.benefits-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
}

.benefit-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
}

.benefit-card:hover {
  transform: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.benefit-icon {
  font-size: 2.5rem;
  color: #f89406;
  margin-bottom: 1rem;
}

.benefit-card h3 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.appliances-section {
  margin-top: 4rem;
}

.appliances-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-title {
  font-weight: bold;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.category-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.category-button:hover,
.category-button.active {
  background: #09753d;
  color: white;
  border-color: #034c26;
  font-weight: bold;
}

.appliances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.loading-container,
.error-container,
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #f89406;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon,
.no-results-icon {
  font-size: 3rem;
  color: #e74c3c;
  margin-bottom: 1rem;
}

.no-results-icon {
  color: #95a5a6;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #f89406;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: #e67e22;
}

.appliance-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.appliance-card:hover {
  transform: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.appliance-card:hover .appliance-image {
  transform: none;
}

.appliance-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.appliance-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.energy-rating {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #27ae60;
  color: white;
  padding: 0.3rem;
  border-radius: 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

.eco-certified {
  background: #2ecc71;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.energy-efficient-icon {
  font-size: 1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.energy-rating-text {
  font-style: normal;
}

.appliance-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.appliance-name {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.appliance-model {
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.appliance-price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #e74c3c;
  margin-bottom: 0.5rem;
}

.appliance-savings {
  color: #27ae60;
  font-weight: bold;
  margin-bottom: 1rem;
}

.appliance-description {
  color: #34495e;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.appliance-features {
  margin-top: auto;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.features-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.features-list {
  padding-left: 1.5rem;
  color: #34495e;
}

.features-list li {
  margin-bottom: 0.3rem;
}

@media (max-width: 768px) {
  .appliances-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-description {
    font-size: 1rem;
  }
}

.data-source-info {
  background-color: rgba(9, 117, 61, 0.1);
  border-left: 4px solid #09753d;
  border-radius: 4px;
  padding: 1.5rem;
  margin-bottom: 5.2rem;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #333;
}

.data-source-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.data-source-icon {
  font-size: 1.5rem;
  color: #09753d;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.data-source-info p {
  margin: 0 0 0.7rem 0;
}

.data-source-info p:last-child {
  margin-bottom: 0;
}

.data-source-info a {
  color: #09753d;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.data-source-info a:hover {
  text-decoration: underline;
  color: #034c26;
}
</style>
