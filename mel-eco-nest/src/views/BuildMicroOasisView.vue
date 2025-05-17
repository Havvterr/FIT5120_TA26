<template>
  <div class="build-micro-oasis">
    <!-- Banner Section -->
    <section id="banner" class="style2">
      <div class="inner">
        <div class="animation-container">
          <div ref="animationContainer" style="width: 300px; height: 300px"></div>
        </div>
        <header class="major">
          <h1>Build Your Micro Oasis</h1>
        </header>
        <div class="content">
          <p>Create your own green sanctuary and contribute to a sustainable future</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <div id="main">
      <section id="one">
        <div class="inner">
          <div class="spotlights">
            <section>
              <div class="content">
                <div class="inner">
                  <header class="major">
                    <h3>Plant Recommendation</h3>
                  </header>
                  <p>Get personalized plant suggestions for your space</p>
                  <ul class="actions">
                    <li>
                      <router-link to="/actions/plant-recommendation" class="button primary"
                        >Get Started</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div class="content">
                <div class="inner">
                  <header class="major">
                    <h3>Planting Guide</h3>
                  </header>
                  <p>Learn how to plant and care for your greenery</p>
                  <ul class="actions">
                    <li>
                      <router-link to="/actions/planting-guide" class="button primary"
                        >View Guide</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div class="content">
                <div class="inner">
                  <header class="major">
                    <h3>AI Balcony Preview</h3>
                  </header>
                  <p>Preview your balcony design with AI</p>
                  <ul class="actions">
                    <li>
                      <router-link to="/actions/ai-balcony-preview" class="button primary"
                        >Try Preview</router-link
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import lottie from 'lottie-web'
import animationData from '../assets/Animation - 1746528140567.json'

const animationContainer = ref(null)
const animation = ref(null)

onMounted(() => {
  try {
    animation.value = lottie.loadAnimation({
      container: animationContainer.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData,
    })

    // Calculate the frame to stop at (0.2 seconds before the end)
    const totalFrames = animationData.op - animationData.ip
    const framesPerSecond = animationData.fr
    const stopFrame = totalFrames - 0.2 * framesPerSecond

    // Stop animation at the calculated frame
    animation.value.addEventListener('enterFrame', () => {
      if (animation.value.currentFrame >= stopFrame) {
        animation.value.pause()
      }
    })
  } catch (error) {
    console.error('Failed to load animation:', error)
  }
})
</script>

<style scoped>
.build-micro-oasis {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f8f8;
}

#banner {
  position: relative;
  background-color: #034c26;
  color: #ffffff;
  text-align: center;
  padding: 4rem 0;
}

.animation-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.major h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.content p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Spotlights */
.spotlights {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0;
}

.spotlights > section {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  overflow: hidden;
}

.spotlights > section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.spotlights .content {
  padding: 2rem;
  flex: 1;
}

.spotlights .inner {
  padding: 0;
}

.spotlights h3 {
  color: #034c26;
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.spotlights p {
  color: #666;
  margin-bottom: 1.5rem;
}

/* Buttons */
.button {
  display: inline-block;
  background-color: #034c26;
  color: #ffffff;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.button.primary {
  background-color: #034c26;
}

.button:hover {
  background-color: #14642e;
}

.actions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.actions li {
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
}

@media (max-width: 768px) {
  .major h1 {
    font-size: 2.2rem;
  }

  .content p {
    font-size: 1rem;
  }

  .spotlights .content {
    padding: 1.5rem;
  }

  .spotlights h3 {
    font-size: 1.5rem;
  }
}
</style>
