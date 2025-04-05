<template>
  <nav
    class="navbar navbar-expand-lg navbar-light fixed-top"
    :class="{ 'navbar-scrolled': scrolled }"
  >
    <div class="container">
      <div class="logo-container navbar-brand" style="cursor: pointer" @click="$router.push('/')">
        <img src="@/assets/Logo.png" alt="Mel Eco Nest Logo" class="logo" />
        <span class="site-name">Melbourne Eco Nest</span>
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
          <li class="nav-item">
            <RouterLink to="/plant-recommendation" class="nav-link" active-class="active"
              >Build Your Micro-Oasis</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link" active-class="active">About Us</RouterLink>
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
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
  transition: all 0.3s ease;
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

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  color: var(--color-heading);
  margin: 0;
  transition: all 0.3s ease;
}

.navbar-scrolled .site-name {
  font-size: 1.3rem;
}

.nav-link {
  color: var(--color-text) !important;
  font-weight: 500;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 0 0.25rem;
}

.nav-link:hover,
.nav-link.active {
  color: var(--vt-c-green) !important;
  background-color: rgba(0, 153, 82, 0.1);
  transform: translateY(-2px);
}

/* Tablet and mobile styles */
@media (max-width: 991px) {
  .navbar-collapse {
    margin-top: 1rem;
    background-color: var(--color-background-soft);
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
</style>
