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
        />
        <div v-if="!previewImage" class="upload-placeholder">
          <i class="upload-icon">📷</i>
          <p>Click to upload a balcony photo</p>
          <p class="upload-hint">Supports JPG, PNG formats</p>
        </div>
        <div v-else class="preview-container">
          <img :src="previewImage" alt="Preview Image" class="preview-image" />
          <button class="remove-btn" @click.stop="removeImage">×</button>
        </div>
      </div>
      <button class="upload-btn" :disabled="!previewImage" @click="showPlantDialog">
        Start AI Design
      </button>
    </div>

    <!-- Plant Selection Dialog -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h2>Select one plant for your balcony design</h2>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>
            Generating your balcony design...<br />
            This process may take up to 1 minute.
          </p>
          <div class="fun-fact-container">
            <div class="fun-fact" :key="currentFunFactIndex">
              <p class="fun-fact-title">🌿 Plant Fun Fact</p>
              <p class="fun-fact-text">{{ plantFunFacts[currentFunFactIndex] }}</p>
            </div>
          </div>
        </div>
        <div v-else class="plants-grid">
          <div
            v-for="plant in plants"
            :key="plant.name"
            class="plant-card"
            :class="{
              selected: selectedPlants.includes(plant.name),
              disabled: selectedPlants.length >= 1 && !selectedPlants.includes(plant.name),
            }"
            @click="togglePlant(plant.name)"
          >
            <div class="plant-image">
              <img
                :src="plant.image_url || 'https://via.placeholder.com/150'"
                :alt="plant.name"
                @error="(e) => (e.target.src = 'https://via.placeholder.com/150')"
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
              <img
                :src="previewImage"
                alt="Original Balcony Photo"
                @click="openImagePreview(previewImage)"
              />
            </div>
            <div class="result-image">
              <h3>Design with {{ selectedPlants[0] }}</h3>
              <img
                v-if="designResult?.imageUrl"
                :src="designResult.imageUrl"
                alt="Design Effect Image"
                @click="openImagePreview(designResult.imageUrl)"
              />
              <div v-else class="loading-placeholder">
                <div class="loading-spinner"></div>
                <p>Loading generated image...</p>
              </div>
              <div class="ai-disclaimer">
                <p>
                  {{
                    designResult?.disclaimer ||
                    'This image is AI-generated and is for reference only. Results may vary in real implementation.'
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="design-description">
            <h3>Selected Plant</h3>
            <div class="selected-plant-tag">{{ selectedPlants[0] }}</div>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="confirm-btn" @click="closeResultDialog">Done</button>
          <button class="retry-btn" @click="retryDesign">Try Different Plant</button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="showImagePreview" class="image-preview-overlay" @click="closeImagePreview">
      <div class="image-preview-container">
        <img :src="previewImageUrl" alt="Preview" class="preview-full-image" />
        <button class="close-preview-btn" @click="closeImagePreview">&times;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { plantService } from '../services/plantService'
import { aiDesignService } from '../services/aiDesignService'

const compressImage = async (file, maxLongSide = 960, maxFileSize = 1024 * 1024) => {
  // If file is already smaller than maximum size, return directly
  if (file.size <= maxFileSize) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result

      img.onload = () => {
        // Calculate dimensions
        let { width, height } = img
        const longSide = Math.max(width, height)

        // If the longest side exceeds the limit, scale proportionally
        if (longSide > maxLongSide) {
          const ratio = maxLongSide / longSide
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            // Create new File object
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            console.log(
              `Original size: ${(file.size / 1024).toFixed(2)}KB, Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`,
            )
            resolve(compressedFile)
          },
          'image/jpeg',
          0.8,
        ) // Use 0.8 JPEG quality
      }
    }
  })
}

const vantaEffect = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)
const selectedFile = ref(null)
const showDialog = ref(false)
const showResultDialog = ref(false)
const showImagePreview = ref(false)
const previewImageUrl = ref(null)
const plants = ref([])
const selectedPlants = ref([])
const loading = ref(false)
const error = ref(null)
const designResult = ref(null)
const pollInterval = ref(null)
const progressMessage = ref('')

// Add plant fun facts array
const plantFunFacts = [
  'Did you know? Plants can communicate with each other through chemical signals!',
  'Plants can recognize their siblings and be more cooperative with them.',
  'Some plants can count! Venus flytraps count the triggers before snapping shut.',
  'Plants can hear water and will grow roots towards it.',
  'Plants release oxygen during the day but consume it at night.',
  'Some trees communicate and share nutrients through an underground fungal network.',
  'Plants can feel touch and respond to it!',
  'Bamboo can grow up to 35 inches in a single day!',
  'Plants have their own immune system to fight off diseases!',
  'Some plants can produce caffeine to prevent other plants from growing nearby.',
  'The oldest living tree is over 5,000 years old!',
  'Plants can see! They can detect different wavelengths of light.',
]

const currentFunFactIndex = ref(0)

// Add auto-rotation function
const startFunFactRotation = () => {
  return setInterval(() => {
    currentFunFactIndex.value = (currentFunFactIndex.value + 1) % plantFunFacts.length
  }, 5000) // Switch every 5 seconds
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    // Save original file reference for preview display
    const originalFile = file

    // Compress image
    const compressedFile = await compressImage(file)
    selectedFile.value = compressedFile

    // Use original file for preview (to maintain preview quality)
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(originalFile)

    console.log(
      `Using compressed image: ${selectedFile.value.name}, Size: ${(selectedFile.value.size / 1024).toFixed(2)}KB`,
    )
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
    plants.value = allPlants.map((p) => ({
      name: p.name,
      image_url: p.image_url,
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
    // Clear previous selections
    selectedPlants.value = []
    // Add newly selected plant
    selectedPlants.value.push(plantName)
  } else {
    // Allow deselection
    selectedPlants.value.splice(index, 1)
  }
}

const startAIDesign = async () => {
  if (!selectedFile.value || selectedPlants.value.length === 0) return

  try {
    loading.value = true
    error.value = null

    // Start fun fact rotation
    const funFactInterval = startFunFactRotation()

    // Clear previous results
    if (designResult.value?.imageUrl) {
      console.log('Cleaning up previous Blob URL')
      URL.revokeObjectURL(designResult.value.imageUrl)
      designResult.value = null
    }

    progressMessage.value = 'Starting design...'

    // Build base prompt (simplified version, detailed enhancement will be done on backend)
    const prompt = selectedPlants.value.join(', ')

    console.log('Starting AI design generation...')
    // Call the new generation API
    const result = await aiDesignService.generateBalconyImage(selectedFile.value, prompt)

    // Stop fun fact rotation
    clearInterval(funFactInterval)

    console.log('Received generation result:', result)
    if (result.success && result.imageUrl) {
      // Ensure image URL is properly set
      designResult.value = {
        imageUrl: result.imageUrl,
        isAIGenerated: result.isAIGenerated || true,
        disclaimer:
          result.disclaimer ||
          'This image is AI-generated and is for reference only. Results may vary in real implementation.',
      }
      console.log('Setting design result URL:', designResult.value.imageUrl)
      showDialog.value = false
      showResultDialog.value = true
    } else {
      throw new Error('Design generation failed - missing image URL')
    }
  } catch (error) {
    console.error('AI design failed:', error)
    error.value =
      error.message || 'An error occurred during the design process, please try again later'
  } finally {
    loading.value = false
  }
}

// Add image preview function
const openImagePreview = (imageUrl) => {
  previewImageUrl.value = imageUrl
  showImagePreview.value = true
}

const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = null
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
  if (designResult.value?.imageUrl) {
    URL.revokeObjectURL(designResult.value.imageUrl)
  }

  if (window._lastBlobUrl) {
    URL.revokeObjectURL(window._lastBlobUrl)
  }

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
  top: 12%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: 'Source Sans Pro', Helvetica, sans-serif;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.plant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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

.cancel-btn,
.confirm-btn {
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  cursor: pointer;
  transition: transform 0.2s ease;
}

.original-image img:hover,
.result-image img:hover {
  transform: scale(1.02);
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
  background: #4caf50;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 20px;
}

.loading-placeholder .loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #39bdb3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.result-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.design-description .selected-plant-tag {
  background: #f0f8ff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-top: 10px;
  color: #333;
  font-weight: 500;
}

.ai-disclaimer {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: rgba(255, 247, 224, 0.9);
  border-left: 4px solid #ffc107;
  border-radius: 4px;
  font-size: 14px;
  color: #856404;
  text-align: left;
  white-space: normal;
  line-height: 1.4;
}

.fun-fact-container {
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.fun-fact {
  animation: fadeInOut 5s ease-in-out infinite;
}

.fun-fact-title {
  font-size: 1.1rem;
  color: #39bdb3;
  font-weight: bold;
  margin-bottom: 10px;
}

.fun-fact-text {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.4;
  margin: 0;
  padding: 0 10px;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.image-preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-full-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-preview-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 32px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.close-preview-btn:hover {
  color: #ddd;
}
</style>
