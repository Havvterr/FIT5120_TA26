<script setup>
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import './assets/styles/pages.css'
import { computed } from 'vue'

const route = useRoute()
const showNavbar = computed(() => !route.meta.hideNavbar)
</script>

<template>
  <div class="app-container">
    <NavBar v-if="showNavbar" />

    <main class="main-content" :class="{ 'no-navbar': !showNavbar }">
      <RouterView />
    </main>
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

.main-content.no-navbar {
  padding-top: 0;
  margin-top: 0;
}
</style>
