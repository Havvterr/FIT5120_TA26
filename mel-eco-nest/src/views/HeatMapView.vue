<template>
  <div class="heat-map-container">
    <h1 class="page-title">Melbourne Heat Island Map</h1>
    <p class="page-description">Through the interactive map below, you can learn about the intensity of the heat island effect in different areas of Melbourne. The map data is based on the latest temperature monitoring records.</p>

    <div class="map-container">
      <div class="map-placeholder">
        <div class="map-overlay">
          <h3>Heat Island Effect Intensity</h3>
          <div class="map-legend">
            <div class="legend-item">
              <div class="color-box" style="background-color: #ffffcc;"></div>
              <span>Low (0-2°C)</span>
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: #fed976;"></div>
              <span>Medium-Low (2-4°C)</span>
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: #fd8d3c;"></div>
              <span>Medium (4-6°C)</span>
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: #e31a1c;"></div>
              <span>High (6-8°C)</span>
            </div>
            <div class="legend-item">
              <div class="color-box" style="background-color: #800026;"></div>
              <span>Very High (>8°C)</span>
            </div>
          </div>
        </div>
        <img src="@/assets/melbourne-map-placeholder.svg" alt="Melbourne Heat Island Map" class="map-image" />
      </div>
    </div>

    <div class="data-section">
      <h2>Heat Island Effect Data Analysis</h2>

      <div class="data-cards">
        <div class="data-card">
          <h3>CBD Temperature Difference</h3>
          <div class="data-value">+7°C</div>
          <p>Maximum temperature difference between Melbourne CBD and surrounding suburbs</p>
        </div>

        <div class="data-card">
          <h3>Heat Island Area</h3>
          <div class="data-value">37 km²</div>
          <p>Coverage area of Melbourne's main heat island effect</p>
        </div>

        <div class="data-card">
          <h3>Annual Growth</h3>
          <div class="data-value">0.3°C</div>
          <p>Annual temperature increase of Melbourne's heat island effect</p>
        </div>
      </div>

      <div class="temperature-chart">
        <h3>Temperature Comparison of Melbourne Areas (Summer Average)</h3>
        <div class="chart-container">
          <div class="chart-bar" style="height: 90%">
            <span class="bar-label">CBD</span>
            <span class="temperature">32.5°C</span>
          </div>
          <div class="chart-bar" style="height: 80%">
            <span class="bar-label">Inner City</span>
            <span class="temperature">30.2°C</span>
          </div>
          <div class="chart-bar" style="height: 70%">
            <span class="bar-label">Middle Suburbs</span>
            <span class="temperature">28.7°C</span>
          </div>
          <div class="chart-bar" style="height: 60%">
            <span class="bar-label">Outer Suburbs</span>
            <span class="temperature">27.1°C</span>
          </div>
          <div class="chart-bar" style="height: 50%">
            <span class="bar-label">Rural Areas</span>
            <span class="temperature">25.8°C</span>
          </div>
        </div>
      </div>
    </div>

    <div class="factors-section">
      <h2>Factors Affecting Heat Island Effect</h2>
      <div class="factors-grid">
        <div class="factor-card">
          <h3>Building Density</h3>
          <p>High-density building areas accumulate more heat and dissipate it more slowly</p>
        </div>
        <div class="factor-card">
          <h3>Green Coverage</h3>
          <p>Trees and vegetation can reduce surrounding temperatures through transpiration</p>
        </div>
        <div class="factor-card">
          <h3>Surface Materials</h3>
          <p>Materials like asphalt and concrete absorb and store large amounts of heat</p>
        </div>
        <div class="factor-card">
          <h3>Human Activities</h3>
          <p>Transportation, industry, and air conditioning generate additional heat</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 未来可以集成真实的地图API和数据
</script>

<style scoped>
.heat-map-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: var(--color-heading);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.page-description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: var(--color-text);
  line-height: 1.6;
}

.map-container {
  background-color: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  position: relative;
  width: 100%;
  height: 500px;
  background-color: #e8f5e9;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 8px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-legend {
  margin-top: 0.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.color-box {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border: 1px solid #ccc;
}

.data-section {
  margin-bottom: 3rem;
}

.data-section h2 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
}

.data-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.data-card {
  flex: 1;
  min-width: 250px;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
}

.data-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.data-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--vt-c-green);
  margin-bottom: 0.5rem;
}

.temperature-chart {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.temperature-chart h3 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 1.5rem;
}

.chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 300px;
  padding: 0 1rem;
}

.chart-bar {
  width: 18%;
  background: linear-gradient(to top, #81c784, #2e7d32);
  border-radius: 8px 8px 0 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 1rem;
  transition: height 0.5s ease;
}

.bar-label {
  position: absolute;
  bottom: -30px;
  color: var(--color-text);
  font-weight: 500;
}

.temperature {
  color: white;
  font-weight: bold;
}

.factors-section {
  margin-bottom: 3rem;
}

.factors-section h2 {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
}

.factors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.factor-card {
  background-color: var(--color-background-soft);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.factor-card:hover {
  transform: translateY(-5px);
}

.factor-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .map-placeholder {
    height: 350px;
  }

  .map-overlay {
    top: 10px;
    right: 10px;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .color-box {
    width: 15px;
    height: 15px;
  }

  .data-cards {
    flex-direction: column;
  }

  .chart-container {
    height: 250px;
  }

  .chart-bar {
    width: 15%;
  }

  .bar-label {
    font-size: 0.8rem;
  }

  .temperature {
    font-size: 0.9rem;
  }
}
</style>
