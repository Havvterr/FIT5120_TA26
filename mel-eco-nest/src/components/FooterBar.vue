<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Melbourne Eco Nest</h3>
        <p>
          Dedicated to raising public awareness about Melbourne's urban heat island effect and
          promoting sustainable urban development.
        </p>

        <div class="contact-info">
          <h3>Contact Us</h3>
          <p>Email: info@melecnest.org</p>
          <p>Phone: (03) 1234 5678</p>
          <p>Address: Melbourne CBD</p>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 Melbourne Eco Nest | Melbourne Urban Heat Island Research Project</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f8f9fa;
  color: #333;
  padding: 2rem 0 0 0;
  margin-top: 3rem;
  width: 100%;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-section {
  flex: 1;
  min-width: 400px;
  margin: 0 auto;
  padding: 0 rem;
  max-width: 100%;
  text-align: center;
}

.footer-section h3 {
  color: #014421;
  margin-bottom: 0.3rem;
  font-size: 1rem;
  font-weight: 600;
}

.footer-section p {
  margin-bottom: 0.5rem;
  line-height: 1.2;
  color: #333;
  font-size: 0.8rem;
}

/* Styles for description text */
.footer-section > p {
  line-height: 1.5;
  margin-bottom: 0.8rem;
}

/* Styles for contact information */
.contact-info p {
  line-height: 1.5; /* Increased line spacing for contact info */
  margin-bottom: 0; /* Remove bottom margin */
}

.contact-info {
  margin-top: 0.2rem;
  padding-top: 0.1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.footer-bottom {
  background-color: #014421;
  color: white;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  margin-top: 2rem;
  width: 100%;
}

@media (min-width: 992px) {
  .footer-section {
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .footer-section {
    margin-bottom: 1rem;
    min-width: 100%;
    padding: 0 1rem;
  }

  .contact-info {
    margin-top: 1.5rem;
    padding-top: 1rem;
  }
}
</style>
