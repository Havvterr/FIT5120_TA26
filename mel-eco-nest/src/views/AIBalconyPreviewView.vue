<template>
  <div class="ai-balcony-preview">
    <h1 class="title">Your AI Designer</h1>
    <div id="vanta-background"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const vantaEffect = ref(null)

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
</style>
