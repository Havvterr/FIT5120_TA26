<template>
  <div class="ai-balcony-preview">
    <h1 class="title">Your AI Designer</h1>
    <div id="vanta-background"></div>

    <!-- File Upload Area -->
    <div class="upload-container">
      <div class="upload-box" @click="triggerFileInput">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="image/*"
          style="display: none"
        >
        <div v-if="!previewImage" class="upload-placeholder">
          <i class="upload-icon">📷</i>
          <p>Click to upload a balcony photo</p>
          <p class="upload-hint">Supports JPG, PNG formats</p>
        </div>
        <div v-else class="preview-container">
          <img :src="previewImage" alt="Preview Image" class="preview-image">
          <button class="remove-btn" @click.stop="removeImage">×</button>
        </div>
      </div>
      <button
        class="upload-btn"
        :disabled="!previewImage"
        @click="showPlantDialog"
      >
        Start AI Design
      </button>
    </div>

    <!-- Plant Selection Dialog -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h2>Select the plants you want to grow (up to 3)</h2>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>{{ progressMessage }}</p>
        </div>
        <div v-else class="plants-grid">
          <div
            v-for="plant in plants"
            :key="plant.name"
            class="plant-card"
            :class="{
              selected: selectedPlants.includes(plant.name),
              disabled: selectedPlants.length >= 3 && !selectedPlants.includes(plant.name)
            }"
            @click="togglePlant(plant.name)"
          >
            <div class="plant-image">
              <img
                :src="plant.image_url || 'https://via.placeholder.com/150'"
                :alt="plant.name"
                @error="e => e.target.src='https://via.placeholder.com/150'"
              />
            </div>
            <div class="plant-info">
              <h3>{{ plant.name }}</h3>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeDialog">Cancel</button>
          <button
            class="confirm-btn"
            :disabled="selectedPlants.length === 0 || loading"
            @click="startAIDesign"
          >
            <span v-if="loading">Processing...</span>
            <span v-else>Start Design</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Design Result Dialog -->
    <div v-if="showResultDialog" class="dialog-overlay">
      <div class="dialog-content result-dialog">
        <h2>Design Result</h2>
        <div class="result-container">
          <div class="image-comparison">
            <div class="original-image">
              <h3>Original Image</h3>
              <img :src="previewImage" alt="Original Balcony Photo">
            </div>
            <div class="result-image">
              <h3>Design Effect</h3>
              <img :src="designResult?.imageUrl" alt="Design Effect Image">
              <a :href="designResult?.imageUrl" target="_blank" class="download-btn">
                View Original
              </a>
            </div>
          </div>
          <div class="design-description">
            <h3>Plant Configuration</h3>
            <ul>
              <li v-for="plant in selectedPlants" :key="plant">{{ plant }}</li>
            </ul>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="confirm-btn" @click="closeResultDialog">Done</button>
          <button class="retry-btn" @click="retryDesign">Redesign</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { plantService } from '../services/plantService'
import { aiDesignService } from '../services/aiDesignService'

const vantaEffect = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)
const selectedFile = ref(null)
const showDialog = ref(false)
const showResultDialog = ref(false)
const plants = ref([])
const selectedPlants = ref([])
const loading = ref(false)
const error = ref(null)
const designResult = ref(null)
const designStatus = ref(null)
const pollInterval = ref(null)
const progressMessage = ref('')

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  previewImage.value = null
  selectedFile.value = null
  fileInput.value.value = ''
}

// Fetch all plant data
const fetchPlants = async () => {
  try {
    loading.value = true
    const allPlants = await plantService.getPlants()
    plants.value = allPlants.map(p => ({
      name: p.name,
      image_url: p.image_url
    }))
  } catch (error) {
    console.error('Failed to fetch plant data:', error)
    error.value = 'Failed to fetch plant list, please try again later'
  } finally {
    loading.value = false
  }
}

const showPlantDialog = () => {
  showDialog.value = true
  fetchPlants()
}

const closeDialog = () => {
  showDialog.value = false
  selectedPlants.value = []
}

const closeResultDialog = () => {
  showResultDialog.value = false
  removeImage()
  selectedPlants.value = []
}

const retryDesign = () => {
  showResultDialog.value = false
  showPlantDialog()
}

const togglePlant = (plantName) => {
  const index = selectedPlants.value.indexOf(plantName)
  if (index === -1) {
    if (selectedPlants.value.length >= 3) {
      alert('You can select up to three plants!')
      return
    }
    selectedPlants.value.push(plantName)
  } else {
    selectedPlants.value.splice(index, 1)
  }
}

const startAIDesign = async () => {
  if (!selectedFile.value || selectedPlants.value.length === 0) return

  try {
    loading.value = true
    error.value = null
    designResult.value = null
    designStatus.value = 'pending'
    progressMessage.value = 'Starting design...'

    // Start design
    const startResponse = await aiDesignService.startDesign(
      selectedFile.value,
      selectedPlants.value.map(name => name)
    )

    // Start polling for results
    designStatus.value = 'processing'
    progressMessage.value = 'Generating image, please wait...'

    const result = await aiDesignService.pollDesignResult(
      startResponse.promptId,
      {
        interval: 5000, // Poll every 5 seconds
        maxAttempts: 60, // Wait up to 5 minutes
        onProgress: (progressData) => {
          designStatus.value = progressData.status
          progressMessage.value = progressData.message

          if (progressData.status === 'error') {
            error.value = progressData.message
            loading.value = false
          }
        }
      }
    )

    if (result.success && result.status === 'completed') {
      designResult.value = result.result
      showDialog.value = false
      showResultDialog.value = true
    } else {
      throw new Error('Design generation failed')
    }
  } catch (error) {
    console.error('AI design failed:', error)

    // Display user-friendly error messages based on error type
    if (error.type === 'UPLOAD_ERROR') {
      error.value = 'Image upload failed, please try again'
    } else if (error.type === 'WORKFLOW_ERROR') {
      error.value = 'Workflow configuration error, please contact the administrator'
    } else if (error.type === 'SUBMISSION_ERROR') {
      error.value = 'Design task submission failed, please try again'
    } else if (error.type === 'SERVER_ERROR') {
      error.value = 'Server error, please try again later'
    } else if (error.type === 'HISTORY_ERROR') {
      error.value = 'Failed to fetch history, please try again'
    } else if (error.type === 'TIMEOUT') {
      error.value = 'Design generation timed out, please try again later'
    } else {
      error.value = error.message || 'An error occurred during the design process, please try again later'
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!window.THREE) {
    await new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
      script.onload = resolve
      document.head.appendChild(script)
    })
  }

  if (!window.VANTA) {
    await new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js'
      script.onload = resolve
      document.head.appendChild(script)
    })
  }

  vantaEffect.value = window.VANTA.NET({
    el: '#vanta-background',
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x39bdb3,
    backgroundColor: 0x30312,
    points: 10.0,
    maxDistance: 18.0,
    spacing: 18.0,
    showDots: true,
  })
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
  if (vantaEffect.value) {
    vantaEffect.value.destroy()
    vantaEffect.value = null
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&family=Indie+Flower&display=swap');

.ai-balcony-preview {
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  z-index: 1;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.title {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: 'Comic Neue', cursive;
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  z-index: 2;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-20px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
}

#vanta-background {
  width: 100%;
  height: 100%;
}

:deep(.footer) {
  display: none;
}

.upload-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
}

.upload-box {
  width: 400px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-box:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.upload-placeholder {
  color: white;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-hint {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 8px;
}

.preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  background: #39bdb3;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.upload-btn:not(:disabled):hover {
  background: #2da89f;
  transform: translateY(-2px);
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.search-box {
  margin: 20px 0;
}

.search-box input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.plants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.plant-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.plant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.plant-card.selected {
  border: 2px solid #39bdb3;
  box-shadow: 0 0 10px rgba(57, 189, 179, 0.3);
}

.plant-card.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.plant-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.plant-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plant-info {
  padding: 15px;
  text-align: center;
}

.plant-info h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .confirm-btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #333;
}

.confirm-btn {
  background: #39bdb3;
  color: white;
}

.confirm-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #fff3f3;
  color: #ff4444;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: center;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #39bdb3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-dialog {
  max-width: 1200px;
  width: 90%;
}

.image-comparison {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.original-image,
.result-image {
  flex: 1;
  text-align: center;
}

.original-image img,
.result-image img {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.retry-btn {
  background: #ff9800;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
}

.retry-btn:hover {
  background: #f57c00;
}

.download-btn {
  display: inline-block;
  margin-top: 10px;
  background: #4CAF50;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 14px;
}

.download-btn:hover {
  background: #45a049;
}

.design-description {
  margin-top: 20px;
  text-align: center;
}

.design-description ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.design-description li {
  background: #f0f8ff;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>
