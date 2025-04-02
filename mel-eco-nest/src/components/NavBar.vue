<template>
  <nav class="navbar">
    <div class="logo-container">
      <img src="@/assets/logo.svg" alt="Mel Eco Nest Logo" class="logo" />
      <span class="site-name">Melbourne Eco Nest</span>
    </div>
    <div class="nav-links">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/heat-map" class="nav-link">Heat Map</RouterLink>
      <RouterLink to="/mitigation" class="nav-link">Mitigation</RouterLink>
      <RouterLink to="/about" class="nav-link">About Us</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-background-soft);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-heading);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--vt-c-green);
  border-bottom: 2px solid var(--vt-c-green);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo-container {
    margin-bottom: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-around;
    gap: 0.5rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
  }
}
</style>