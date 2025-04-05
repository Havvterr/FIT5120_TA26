<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Melbourne Urban Heat Island Effect</h1>
        <p class="hero-subtitle">
          Explore urban heat islands and its impact on the environment and residents
        </p>
        <div class="hero-buttons">
          <RouterLink to="/heat-map" class="hero-button primary">View Heat Map</RouterLink>
          <RouterLink to="/mitigation" class="hero-button secondary"
            >Learn Mitigation Measures</RouterLink
          >
        </div>
      </div>
    </div>

    <div class="intro-section">
      <div class="intro-card">
        <div class="intro-icon thermometer"></div>
        <h2>What is the Urban Heat Island Effect?</h2>
        <p>
          The urban heat island effect refers to the phenomenon where urban areas experience
          significantly higher temperatures than surrounding rural areas, primarily caused by human
          activities and building materials. Materials like concrete and asphalt in cities absorb
          and store large amounts of heat, leading to increased urban temperatures.
        </p>
      </div>

      <div class="intro-card">
        <div class="intro-icon city"></div>
        <h2>Melbourne's Heat Island Effect</h2>
        <p>
          Melbourne's CBD can be 4-7°C warmer than surrounding suburbs, especially during summer
          heat waves. This temperature difference significantly impacts the health, energy
          consumption, and quality of life of urban residents.
        </p>
      </div>

      <div class="intro-card">
        <div class="intro-icon solution"></div>
        <h2>How to Mitigate the Heat Island Effect</h2>
        <p>
          Increasing urban green spaces, using reflective building materials, reducing vehicle use,
          and promoting green roofs and vertical gardens are effective measures to mitigate the
          urban heat island effect and create more livable urban environments.
        </p>
      </div>
    </div>

    <div class="facts-section">
      <h2 class="section-title">Key Data on Heat Island Effect</h2>
      <div class="facts-container">
        <div class="fact-card">
          <div class="fact-number">7°C</div>
          <p>Maximum temperature difference between Melbourne CBD and suburbs</p>
        </div>

        <div class="fact-card">
          <div class="fact-number">15%</div>
          <p>Additional energy consumption caused by heat island effect</p>
        </div>

        <div class="fact-card">
          <div class="fact-number">30%</div>
          <p>Potential urban temperature reduction through increased greenery</p>
        </div>

        <div class="fact-card">
          <div class="fact-number">2050</div>
          <p>Melbourne's carbon neutrality target year</p>
        </div>
      </div>
    </div>

    <div class="impact-section">
      <h2 class="section-title">Impacts of Heat Island Effect</h2>
      <div class="impact-grid">
        <div class="impact-item">
          <h3>Health Risks</h3>
          <p>
            High temperatures increase the risk of heat stroke, heat exhaustion, and cardiovascular
            diseases, especially affecting the elderly and children
          </p>
        </div>

        <div class="impact-item">
          <h3>Energy Consumption</h3>
          <p>
            Increased air conditioning use leads to higher energy consumption, further exacerbating
            greenhouse gas emissions
          </p>
        </div>

        <div class="impact-item">
          <h3>Air Quality</h3>
          <p>
            High temperatures accelerate chemical reactions of air pollutants, reducing urban air
            quality
          </p>
        </div>

        <div class="impact-item">
          <h3>Biodiversity</h3>
          <p>
            Rising urban temperatures affect the survival environment of local plants and animals
          </p>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="cta-content">
        <h2>Take Action Together to Mitigate Melbourne's Heat Island Effect</h2>
        <p>
          Learn more about the heat island effect and explore how to improve Melbourne's urban
          environment through individual and community actions
        </p>
        <RouterLink to="/mitigation" class="cta-button">View Mitigation Measures</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

.hero-section {
  background:
    linear-gradient(rgba(0, 0, 0, 0.27), rgba(0, 0, 0, 0.08)),
    url('@/assets/melskyline.jpg') no-repeat center center;
  background-size: cover;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  padding: 0 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: white;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.hero-button {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}

.hero-button.primary {
  background-color: var(--vt-c-green);
  color: white;
}

.hero-button.secondary {
  background-color: transparent;
  color: white;
  border: 2px solid white;
}

.hero-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.intro-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
  gap: 2rem;
}

.intro-card {
  flex: 1;
  min-width: 300px;
  background-color: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.intro-card:hover {
  transform: translateY(-5px);
}

.intro-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1.5rem;
  background-color: var(--vt-c-green-lighter);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-card h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.facts-section {
  background-color: var(--color-background-soft);
  padding: 4rem 2rem;
  margin-bottom: 3rem;
}

.facts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
}

.fact-card {
  flex: 1;
  min-width: 200px;
  max-width: 250px;
  text-align: center;
  padding: 2rem;
  background-color: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.fact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.fact-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--vt-c-green);
  margin-bottom: 1rem;
}

.fact-card p {
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.5;
}

.section-title {
  text-align: center;
  color: var(--vt-c-green);
  margin-bottom: 3rem;
  font-size: 2rem;
}

.impact-section {
  max-width: 1200px;
  margin: 0 auto 3rem;
  padding: 0 2rem;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.impact-item {
  background-color: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.impact-item:hover {
  transform: translateY(-5px);
}

.impact-item h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.cta-section {
  background-color: var(--vt-c-green);
  color: rgb(0, 0, 0);
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
}

.cta-content p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: rgb(0, 153, 82);
  color: var(--vt-c-green);
  font-weight: bold;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
  }

  h1 {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .intro-section {
    flex-direction: column;
  }

  .fact-card {
    min-width: 100%;
  }

  .section-title {
    font-size: 1.8rem;
  }
}
</style>
