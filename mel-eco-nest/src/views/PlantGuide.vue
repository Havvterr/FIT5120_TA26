<template>
    <div class="plant-guide-page">
      <h1>{{ plant.name }} - Care Guide</h1>
      <!-- Display plant image if available -->
      <div v-if="plant.image_url">
        <img :src="plant.image_url" :alt="plant.name" />
      </div>
      <!-- Display plant details -->
      <p><strong>Species:</strong> {{ plant.species }}</p>
      <p><strong>Sunlight Needs:</strong> {{ plant.sunlight_needs }}</p>
      <p><strong>Water Needs:</strong> {{ plant.water_needs }}</p>
      <p><strong>Temperature Range:</strong> {{ plant.temperature_range }}</p>
      <p><strong>Maintenance Level:</strong> {{ plant.maintenance_level }}</p>
      <hr />
      <!-- Display the care guide -->
      <h4>Care Guide</h4>
      <p>{{ plant.guide }}</p>
      <p class="plant-description">{{ plant.description }}</p>
      <!-- Back button -->
      <button class="back-button" @click="goBack">Back to Recommendations</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getPlantById } from '../services/plantService'  // Ensure this file exists and exports getPlantById
  
  const route = useRoute()
  const router = useRouter()
  const plant = ref({})
  
  onMounted(async () => {
    const plantId = route.params.id  // get the id from the route (e.g., /plant-guide/5)
    try {
      plant.value = await getPlantById(plantId)
      console.log("Fetched plant data:", plant.value)
    } catch (error) {
      console.error("Failed to fetch plant data:", error)
    }
  })
  
  const goBack = () => {
    router.back()
  }
  </script>
  
  <style scoped>
  .plant-guide-page {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .plant-guide-page img {
    max-width: 100%;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  .back-button {
    background-color: #42b983;
    color: #fff;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }
  </style>
  