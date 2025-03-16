<template>
  <div id="app">
    <!-- Modern Navigation Bar -->
    <nav class="navbar" :class="{ 'navbar-transparent': isHomePage }">
      <div class="container">
        <router-link to="/" class="navbar-brand">
          <img
            src="@/assets/uv_defender_logo.png"
            alt="UV Defender Logo"
            class="nav-logo"
          />
          <span>UV Defender</span>
        </router-link>

        <!-- Mobile Menu Toggle -->
        <div class="menu-toggle" @click="toggleMenu">
          <div class="hamburger" :class="{ active: menuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links" :class="{ active: menuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">
            <i class="fas fa-home"></i> Home
          </router-link>
          <router-link to="/uv-levels" class="nav-link" @click="closeMenu">
            <i class="fas fa-sun"></i> UV Levels
          </router-link>
          <router-link to="/uv-impact-info" class="nav-link" @click="closeMenu">
            <i class="fas fa-chart-line"></i> UV Impact Info
          </router-link>
          <router-link
            to="/personalized-advice"
            class="nav-link"
            @click="closeMenu"
          >
            <i class="fas fa-user-shield"></i> Personalized Advice
          </router-link>
          <router-link
            to="/sunscreen-reminders"
            class="nav-link"
            @click="closeMenu"
          >
            <i class="fas fa-clock"></i> Sunscreen Reminders
          </router-link>
          <router-link
            to="/sun-safe-products"
            class="nav-link"
            @click="closeMenu"
          >
            <i class="fas fa-shopping-bag"></i> Sun-Safe Products
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main id="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      menuOpen: false,
    };
  },
  computed: {
    isHomePage() {
      return this.$route.path === "/";
    },
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      document.body.classList.toggle("no-scroll", this.menuOpen);
    },
    closeMenu() {
      if (this.menuOpen) {
        this.menuOpen = false;
        document.body.classList.remove("no-scroll");
      }
    },
    updateBodyClass() {
      if (this.isHomePage) {
        document.body.classList.add("home-page");
      } else {
        document.body.classList.remove("home-page");
      }
    },
  },
  watch: {
    $route() {
      this.closeMenu();
      this.updateBodyClass();
    },
  },
  mounted() {
    this.updateBodyClass();
  },
};
</script>

<style>
/* Global Styles */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  color: #333;
  min-height: 100vh;
}

body.no-scroll {
  overflow: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation Bar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 15px 0;
  transition: all 0.3s ease;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-transparent {
  background-color: transparent;
  box-shadow: none;
}

.navbar-transparent .nav-link,
.navbar-transparent .navbar-brand span {
  color: #000;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #292727;
  font-weight: 700;
  font-size: 1.5rem;
}

.navbar-transparent .navbar-brand {
  color: white;
}

.nav-logo {
  height: 35px;
  margin-right: 10px;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #333;
  text-decoration: none;
  padding: 10px 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link i {
  margin-right: 5px;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #007bff;
}

.navbar-transparent .nav-link:hover,
.navbar-transparent .nav-link.router-link-active {
  color: #e1c5c5;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Mobile Menu */
.menu-toggle {
  display: none;
  cursor: pointer;
}

.hamburger {
  width: 30px;
  height: 20px;
  position: relative;
}

.hamburger span {
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  background: #333;
  border-radius: 3px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}

.navbar-transparent .hamburger span {
  background: white;
}

.hamburger span:nth-child(1) {
  top: 0px;
}

.hamburger span:nth-child(2) {
  top: 8px;
}

.hamburger span:nth-child(3) {
  top: 16px;
}

.hamburger.active span:nth-child(1) {
  top: 8px;
  transform: rotate(135deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  left: -60px;
}

.hamburger.active span:nth-child(3) {
  top: 8px;
  transform: rotate(-135deg);
}

/* Main Content */
main {
  flex: 1;
}

/* Only add margin-top to non-home pages */
body:not(.home-page) main {
  margin-top: 70px;
}

/* Footer */
.footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  text-align: center;
}

.footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #007bff;
  color: white;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
}

/* Responsive Design */
@media (max-width: 992px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    height: calc(100vh - 70px);
    background-color: white;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 30px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    overflow-y: auto;
  }

  .nav-links.active {
    transform: translateX(0);
  }

  .nav-link {
    margin: 10px 0;
    font-size: 1.2rem;
  }

  .navbar-transparent .nav-links {
    background-color: rgba(12, 11, 11, 0.9);
  }

  .navbar-transparent .nav-links .nav-link {
    color: white;
  }

  main {
    margin-top: 70px;
  }
}

@media (max-width: 576px) {
  .footer .container {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
