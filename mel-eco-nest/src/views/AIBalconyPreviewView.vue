<template>
  <div class="ai-balcony-preview">
    <h1 class="title">Your AI Designer</h1>
    <div id="vanta-background"></div>

    <!-- 文件上传区域 -->
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
          <p>点击上传阳台照片</p>
          <p class="upload-hint">支持 JPG、PNG 格式</p>
        </div>
        <div v-else class="preview-container">
          <img :src="previewImage" alt="预览图片" class="preview-image">
          <button class="remove-btn" @click.stop="removeImage">×</button>
        </div>
      </div>
      <button
        class="upload-btn"
        :disabled="!previewImage"
        @click="showPlantDialog"
      >
        开始AI设计
      </button>
    </div>

    <!-- 植物选择对话框 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog-content">
        <h2>选择您想种植的植物（最多3种）</h2>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="plants-grid">
          <div
            v-for="plant in plants"
            :key="plant.name"
            class="plant-card"
            :class="{ selected: selectedPlants.includes(plant.name), disabled: selectedPlants.length >= 3 && !selectedPlants.includes(plant.name) }"
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
          <button class="cancel-btn" @click="closeDialog">取消</button>
          <button
            class="confirm-btn"
            :disabled="selectedPlants.length === 0 || loading"
            @click="startAIDesign"
          >
            <span v-if="loading">处理中...</span>
            <span v-else>开始设计</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { plantService } from '../services/plantService'

const vantaEffect = ref(null)
const fileInput = ref(null)
const previewImage = ref(null)
const selectedFile = ref(null)
const showDialog = ref(false)
const plants = ref([])
const selectedPlants = ref([])
const loading = ref(false)
const error = ref(null)

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

// 获取所有植物数据
const fetchPlants = async () => {
  try {
    loading.value = true
    const allPlants = await plantService.getPlants()
    // 只保留name和image_url字段
    plants.value = allPlants.map(p => ({
      name: p.name,
      image_url: p.image_url
    }))
  } catch (error) {
    console.error('获取植物数据失败:', error)
    error.value = '获取植物列表失败，请稍后重试'
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

const togglePlant = (plantName) => {
  const index = selectedPlants.value.indexOf(plantName)
  if (index === -1) {
    if (selectedPlants.value.length >= 3) {
      alert('最多只能选择三种植物！')
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

    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('plants', JSON.stringify(selectedPlants.value))

    // TODO: 调用AI设计API
    console.log('开始设计，选中的植物:', selectedPlants.value)
    closeDialog()
  } catch (error) {
    console.error('AI设计失败:', error)
    error.value = 'AI设计启动失败，请稍后重试'
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
</style>
