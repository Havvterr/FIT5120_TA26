<template>
  <div class="energy-journey">
    <div class="journey-navigation" data-aos="fade-right">
      <h2 class="nav-title">Energy Journey</h2>
      <nav class="journey-nav">
        <router-link to="/energy-journey/progress" class="nav-item">
          <i class="fas fa-chart-line"></i>
          <span>Progress Tracker</span>
        </router-link>
        <router-link to="/energy-journey/my-plan" class="nav-item">
          <i class="fas fa-clipboard-list"></i>
          <span>My Plan</span>
        </router-link>
        <router-link to="/energy-journey/goal-tracker" class="nav-item">
          <i class="fas fa-bullseye"></i>
          <span>Goal Tracker</span>
        </router-link>
      </nav>
    </div>
    <div class="journey-content" data-aos="fade-left" data-aos-delay="300">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
  })
})
</script>

<style scoped>
.energy-journey {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.journey-navigation {
  width: 280px;
  flex-shrink: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.nav-title {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #edf2f7;
}

.journey-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  color: #4a5568;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background-color: #f4f6f8;
  transform: translateX(5px);
}

.nav-item.router-link-active {
  background-color: #1e6a93;
  color: white;
}

.nav-item i {
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

.journey-content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .energy-journey {
    flex-direction: column;
  }

  .journey-navigation {
    width: 100%;
    position: relative;
    top: 0;
  }

  .journey-nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .nav-item {
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 640px) {
  .nav-item {
    width: 100%;
  }
}
</style>
