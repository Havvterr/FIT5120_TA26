<template>
  <div class="uv-impact-container">
    <h1>UV Impact Information</h1>
    <p class="description">
      Understanding the impact of UV radiation in Australia is crucial for
      developing effective sun safety habits. Australia has one of the highest
      UV levels globally, making sun protection particularly important for all
      Australians.
    </p>

    <div class="charts-container">
      <div class="chart-box">
        <h2>Australia's Annual Mean UV Index</h2>
        <div class="image-wrapper">
          <img
            src="@/assets/annually-uv.png"
            alt="Australia's Annual Mean UV Index"
            class="chart-image"
          />
        </div>
        <p class="chart-description">
          This table shows the average annual UV Index in Australia. From the
          chart, it can be observed that the UV Index peaked in 2000, followed
          by a period of stability and a slight decline. This may indicate the
          impact of human activities and environmental conservation efforts on
          the ozone layer.
        </p>
      </div>

      <div class="chart-box">
        <h2>Melanoma Skin Cancer Incidence Rates (1982-2019)</h2>
        <div class="image-wrapper">
          <img
            src="@/assets/melanoma.png"
            alt="Melanoma Incidence Rates by Sex"
            class="chart-image"
          />
        </div>
        <p class="chart-description">
          This chart displays age-standardised incidence rates for melanoma of
          the skin from 1982 to 2019, separated by sex. Males consistently show
          higher rates of melanoma skin cancer compared to females.
        </p>
      </div>
    </div>

    <div class="info-section">
      <h2>Key Facts About UV Radiation in Australia</h2>
      <ul class="fact-list">
        <li>
          Australia has one of the highest rates of skin cancer in the world.
        </li>
        <li>
          UV radiation can cause sunburn, skin damage, eye damage, and skin
          cancer.
        </li>
        <li>UV radiation can be high even on cloudy days.</li>
        <li>
          The UV Index is highest during the middle of the day, typically
          between 10am and 2pm.
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "UVImpactInfo",
};
</script>

<style scoped>
.uv-impact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  position: relative;
  background-color: #f9fcff;
  border-radius: 15px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.05);
}

h1 {
  color: #1e5799;
  text-align: center;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 0;
}

.description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 30px;
  color: #333;
  line-height: 1.6;
  background-color: rgba(227, 242, 253, 0.9);
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: none;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  margin-bottom: 40px;
}

.chart-box {
  flex: 1;
  min-width: 300px;
  max-width: 550px;
  background-color: transparent;
  border-radius: 12px;
  padding: 25px;
  transition: transform 0.3s ease;
  box-shadow: none;
  border-top: none;
}

.chart-box:hover {
  transform: translateY(-5px);
  box-shadow: none;
}

.chart-box h2 {
  color: #1e5799;
  font-size: 1.4rem;
  margin-bottom: 20px;
  text-align: center;
  background-color: rgba(227, 242, 253, 0.9);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
  background-color: transparent;
}

.chart-image {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  transition: transform 0.3s ease;
}

.chart-image:hover {
  transform: scale(1.02);
}

.chart-description {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
  background-color: rgba(227, 242, 253, 0.9);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-section {
  background: linear-gradient(to bottom right, #e3f2fd, #bbdefb);
  border-radius: 12px;
  padding: 30px;
  margin-top: 40px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.info-section h2 {
  color: #1e5799;
  text-align: center;
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 8px;
}

.fact-list {
  list-style-type: none;
  padding: 0;
}

.fact-list li {
  padding: 12px 15px 12px 35px;
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.fact-list li:before {
  content: "*";
  color: #1e88e5;
  font-size: 1.5em;
  position: absolute;
  left: 15px;
  top: 10px;
}

@media (max-width: 768px) {
  .charts-container {
    flex-direction: column;
  }

  .chart-box {
    max-width: 100%;
  }
}
</style>
