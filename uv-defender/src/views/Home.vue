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
            <i class="fas fa-user-shield"></i>
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
  position: absolute;
  top: 0;
  left: 0;
}

.hero-section {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("@/assets/uv_defender.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70px 20px 40px; /* Increased top padding to make room for navbar */
  color: white;
}

/* Logo & Title */
.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
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
  max-width: 800px;
  margin-bottom: 60px;
}

.info-box {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-box h2 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: white;
}

.info-box p {
  font-size: 1.2rem;
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
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  color: #333;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #007bff;
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

/* Responsive design */
@media (max-width: 768px) {
  .feature-cards {
    grid-template-columns: 1fr;
    max-width: 500px;
  }

  .info-box {
    padding: 30px;
  }

  .info-box h2 {
    font-size: 1.8rem;
  }

  .info-box p {
    font-size: 1rem;
  }
}
</style>
