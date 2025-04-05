<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Melbourne Eco Nest</h3>
        <p>Dedicated to raising public awareness about Melbourne's urban heat island effect and promoting sustainable urban development.</p>
      </div>

      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/heat-map">Heat Map</RouterLink></li>
          <li><RouterLink to="/mitigation">Mitigation</RouterLink></li>
          <li><RouterLink to="/plant-recommendation">Plant Recommendation</RouterLink></li>
          <li><RouterLink to="/about">About Us</RouterLink></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Contact Us</h3>
        <p>Email: info@melecnest.org</p>
        <p>Phone: (03) 1234 5678</p>
        <p>Address: Melbourne CBD</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Melbourne Eco Nest | Melbourne Urban Heat Island Research Project</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.footer {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 2rem 0 0 0;
  margin-top: 3rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-section {
  flex: 1;
  min-width: 250px;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.footer-section h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.footer-section p {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--vt-c-green);
}

.footer-bottom {
  background-color: var(--vt-c-green);
  color: white;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
  }

  .footer-section {
    margin-bottom: 1.5rem;
  }
}
</style>
