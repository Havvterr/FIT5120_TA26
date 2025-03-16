<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">UV Defender</router-link>
        <div class="navbar-nav">
          <router-link to="/personalized-advice" class="tab">
            Personalised Sun Safety Advice
          </router-link>
        </div>
      </div>
    </nav>

    <main id="main-content">
      <router-view></router-view>
    </main>

    <!-- Remove or comment out the footer if you don't want it -->
    <!--
    <footer class="text-center py-3">
      <p>© 2024 My Health App. All Rights Reserved.</p>
    </footer>
    -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* You can keep or remove these styles as needed */
#app {
  font-family: Arial, sans-serif;
  color: #333;
}

main {
  min-height: 60vh;
  padding: 20px;
}
</style>
