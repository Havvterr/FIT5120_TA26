<template>
  <div class="home-landing">
    <!-- Logo & Title Container -->
    <div class="logo-container">
      <!-- Logo Image -->
      <img
        src="@/assets/uv_defender_logo.png"
        alt="UV Defender Logo"
        class="logo"
      />
      <!-- Name Next to Logo -->
      <h1 class="app-name">UV Defender</h1>
    </div>

    <div class="landing-container">
      <div class="info-box">
        <h2>Welcome</h2>
        <p>
          UV Defender is your trusted resource for sun safety information. Learn
          how to protect yourself from harmful UV rays while understanding the
          balance between sun protection and vitamin D needs.
        </p>
        <p>
          Our goal is to provide clear, up-to-date tips and advice on sun-safe
          practices so you can stay informed and safe under the sun.
        </p>
        <button @click="goToCheckUV">Check Your UV Level</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    goToCheckUV() {
      this.$router.push("/check-uv");
    },
  },
};
</script>

<style scoped>
.home-landing {
  height: 100vh;
  width: 100%;
  background: url("@/assets/uv_defender.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  flex-direction: column; /* Stack logo and box vertically */
  align-items: center;
  justify-content: flex-start; /* Logo at top, info box further down */
  padding-top: 40px; /* Space for the logo area at the top */
}

/* Logo & Title Container */
.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 80px; /* Adjust as needed */
  height: auto;
  margin-right: 10px;
}

.app-name {
  font-size: 2rem;
  font-weight: 700;
  color: #fff; /* White text to stand out against the background */
  margin: 0;
}

.landing-container {
  width: 90%;
  max-width: 800px;
  padding: 20px;
}

.info-box {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info-box h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
}

.info-box p {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #555;
}

.info-box button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
