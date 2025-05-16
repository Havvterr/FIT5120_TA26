<template>
  <aside class="side-nav">
    <ul>
      <li>
        <router-link to="/actions/plant-recommendation" class="nav-link">
          <span class="nav-icon">P</span>
          <span class="nav-text">Plant Recommendation</span>
        </router-link>
      </li>
      <li>
        <router-link to="/actions/planting-guide" class="nav-link">
          <span class="nav-icon">G</span>
          <span class="nav-text">Planting Guide</span>
        </router-link>
      </li>
      <li>
        <router-link to="/actions/ai-balcony-preview" class="nav-link">
          <span class="nav-icon">A</span>
          <span class="nav-text">AI Balcony Preview</span>
        </router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
// Component logic
</script>

<style scoped>
/* Side Navigation Bar Styles */
.side-nav {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0 10px 10px 0;
  z-index: 100;
  padding: 15px 5px;
}

.side-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-nav li {
  margin-bottom: 20px;
}

.side-nav li:last-child {
  margin-bottom: 0;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #2a99b7;
  color: white;
}

.nav-icon {
  font-size: 1.5rem;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 0.7rem;
  text-align: center;
}
</style>
