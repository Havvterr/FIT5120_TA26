<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <FooterBar />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 0;
  padding-bottom: 2rem;
}
</style>
