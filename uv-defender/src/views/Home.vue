<template>
  <div class="home-container">
    <!-- Full-screen background -->
    <div class="hero-section">
      <!-- Logo & Title -->
      <div class="logo-container">
        <img
          src="@/assets/uv_defender_logo.png"
          alt="UV Defender Logo"
          class="logo"
        />
        <h1 class="app-name">UV Defender</h1>
      </div>

      <!-- Main content -->
      <div class="hero-content">
        <div class="info-box">
          <h2>Protect Your Skin, Enjoy the Sun</h2>
          <p>
            UV Defender is your sun protection assistant, helping you understand
            UV index, providing personalized sunscreen advice, and balancing
            skin health with vitamin D needs.
          </p>
          <p>
            Our goal is to provide young Australians with clear, practical sun
            protection information, allowing you to enjoy outdoor activities
            while effectively protecting your skin from UV damage.
          </p>
        </div>
      </div>

      <!-- Feature navigation cards -->
      <div class="feature-cards">
        <div class="feature-card" @click="navigateTo('/uv-levels')">
          <div class="card-icon">
            <i class="fas fa-sun"></i>
          </div>
          <h3>UV Index Check</h3>
          <p>
            Check UV index in different locations and find the best time for
            outdoor activities
          </p>
        </div>

        <div class="feature-card" @click="navigateTo('/uv-impact-info')">
          <div class="card-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>UV Impact Data</h3>
          <p>
            Learn about UV effects on skin and view Australian skin cancer data
            and trends
          </p>
        </div>

        <div class="feature-card" @click="navigateTo('/personalized-advice')">
          <div class="card-icon">
            <i class="fa-solid fa-handshake-angle"></i>
          </div>
          <h3>Personalized Advice</h3>
          <p>
            Get customized sun protection plans and vitamin D recommendations
            based on your skin type
          </p>
        </div>

        <div class="feature-card" @click="navigateTo('/sunscreen-reminders')">
          <div class="card-icon">
            <i class="fas fa-clock"></i>
          </div>
          <h3>Sunscreen Reminders</h3>
          <p>
            Set reminders to reapply sunscreen and maintain protection
            throughout the day
          </p>
        </div>

        <div class="feature-card" @click="navigateTo('/sun-safe-products')">
          <div class="card-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <h3>Sun-Safe Products</h3>
          <p>
            Browse and purchase quality sun protection products, including
            sunscreen, clothing, and sunglasses
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.hero-section {
  min-height: 100vh;
  width: 100%;
  background: url("@/assets/uv_defender.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 105px 20px 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 0;
}

.logo-container,
.hero-content,
.feature-cards {
  position: relative;
  z-index: 1;
}

/* Logo & Title */
.logo-container {
  display: flex;
  align-items: center;
  margin-top: -10px;
  margin-bottom: 50px;
}

.logo {
  width: 80px;
  height: auto;
  margin-right: 15px;
}

.app-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Main content */
.hero-content {
  width: 100%;
  max-width: 750px;
  margin-top: -5px;
  margin-bottom: 80px;
}

.info-box {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-box h2 {
  font-size: 2.3rem;
  margin-bottom: 20px;
  color: white;
}

.info-box p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* Feature navigation cards */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: #333;
}

.feature-card:hover {
  transform: translateY(-10px);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #2467af;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.feature-card p {
  font-size: 1rem;
  color: #555;
  line-height: 1.5;
}
</style>
