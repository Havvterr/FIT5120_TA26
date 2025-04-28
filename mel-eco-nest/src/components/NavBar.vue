<template>
  <nav
    class="navbar navbar-expand-lg navbar-light fixed-top"
    :class="{ 'navbar-scrolled': scrolled }"
  >
    <div class="container">
      <div class="logo-container navbar-brand" style="cursor: pointer" @click="$router.push('/')">
        <img src="@/assets/Logo.png" alt="Mel Eco Nest Logo" class="logo" />
        <span class="site-name">MelEcoNest</span>
      </div>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link" active-class="active">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/heat-map" class="nav-link" active-class="active">Heat Map</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/mitigation" class="nav-link" active-class="active"
              >Mitigation</RouterLink
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Build Your Micro-Oasis
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/plant-recommendation" class="dropdown-item"
                  >Plant Recommendation</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/water-reminder" class="dropdown-item"
                  >Set Water Reminder</RouterLink
                >
              </li>
              <li>
                <RouterLink to="/planting-guide" class="dropdown-item">Planting Guide</RouterLink>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Energy Journey
            </a>
            <ul class="dropdown-menu">
              <li>
                <RouterLink to="/energy-progress" class="dropdown-item">Energy Progress</RouterLink>
              </li>
              <li>
                <RouterLink to="/energy-plan" class="dropdown-item">My Plan</RouterLink>
              </li>
              <li>
                <RouterLink to="/energy-goals" class="dropdown-item">Goal Tracker</RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!-- Add spacer div to prevent content from being hidden under fixed navbar -->
  <div class="navbar-spacer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  background-color: #fdfdfd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
  max-width: 100%;
  margin: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: auto;
  padding-left: 2rem;
}

.navbar-nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  padding-right: 2rem;
}

.navbar-scrolled {
  padding: 0.7rem 0;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* Spacer div height matches navbar height */
.navbar-spacer {
  height: 80px;
}

.logo {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.navbar-scrolled .logo {
  width: 34px;
  height: 34px;
}

.site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #090b09;
  margin: 0;
  transition: all 0.3s ease;
}

.navbar-scrolled .site-name {
  font-size: 1.3rem;
}

.nav-link {
  position: relative;
  color: #232323 !important;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
  text-decoration: none;
}

.nav-link:hover {
  color: #014421 !important;
  transform: translateY(-2px);
  font-weight: 650;
  letter-spacing: 0.2px;
}

.nav-link.active {
  color: #014421 !important;
  font-weight: 650;
}

/* Remove all pseudo-elements and complex effects */
.nav-link::before,
.nav-link::after {
  display: none;
}

/* Tablet and mobile styles */
@media (max-width: 991px) {
  .navbar-collapse {
    margin-top: 1rem;
    background-color: #fdfdfd;
    border-radius: 8px;
    padding: 0.5rem;
  }

  .navbar-scrolled .navbar-collapse {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }

  .nav-link {
    padding: 0.75rem 1rem !important;
    text-align: center;
  }

  .nav-item {
    margin: 0.25rem 0;
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  .navbar-spacer {
    height: 70px;
  }

  .site-name {
    font-size: 1.25rem;
  }

  .navbar-scrolled .site-name {
    font-size: 1.1rem;
  }

  .logo {
    width: 32px;
    height: 32px;
  }

  .navbar-scrolled .logo {
    width: 28px;
    height: 28px;
  }
}

.dropdown-menu {
  background-color: #fdfdfd;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}

.dropdown-item {
  color: #232323;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
  color: #014421;
  transform: translateX(5px);
}

.navbar-scrolled .dropdown-menu {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
</style>
