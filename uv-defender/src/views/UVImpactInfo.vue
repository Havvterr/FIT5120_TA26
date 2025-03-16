<template>
  <div class="uv-impact-container">
    <h1>UV Impact Information</h1>
    <p class="description">
      Understanding the impact of UV radiation in Australia is crucial for
      developing effective sun safety habits. Below are visualizations showing
      the impact of UV exposure based on age groups and the trend of heat in
      Australia.
    </p>

    <div class="charts-container">
      <div class="chart-box">
        <h2>Skin Cancer Incidence by Age Group</h2>
        <div class="chart-wrapper">
          <canvas id="skinCancerChart" ref="skinCancerChart"></canvas>
        </div>
        <p class="chart-description">
          This chart shows the incidence rate of skin cancer per 100,000 people
          across different age groups in Australia. The risk increases
          significantly with age, highlighting the importance of sun protection
          throughout life.
        </p>
      </div>

      <div class="chart-box">
        <h2>Average Temperature Trend in Australia</h2>
        <div class="chart-wrapper">
          <canvas id="temperatureChart" ref="temperatureChart"></canvas>
        </div>
        <p class="chart-description">
          This chart shows the trend of average temperatures in Australia over
          the past decade. Rising temperatures are associated with increased UV
          radiation exposure, making sun protection increasingly important.
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
          Two in three Australians will be diagnosed with skin cancer by the age
          of 70.
        </li>
        <li>
          UV radiation can cause sunburn, skin damage, eye damage, and skin
          cancer.
        </li>
        <li>UV radiation can be high even on cool or cloudy days.</li>
        <li>
          The UV Index is highest during the middle of the day, typically
          between 10am and 2pm (11am and 3pm daylight saving time).
        </li>
      </ul>
    </div>

    <div class="loading-overlay" v-if="loading">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";

export default {
  name: "UVImpactInfo",
  data() {
    return {
      loading: true,
      skinCancerData: [],
      temperatureData: [],
      skinCancerChart: null,
      temperatureChart: null,
    };
  },
  async mounted() {
    try {
      // 从数据库获取数据，而不是直接从API获取
      // 这里我们使用的是后端API，但后端会从数据库获取数据
      const response = await axios.get("/api/uv-impact-data/from-database");
      this.skinCancerData = response.data.skinCancerByAgeGroup;
      this.temperatureData = response.data.heatTrendInAustralia;

      // 创建图表
      this.$nextTick(() => {
        this.createSkinCancerChart();
        this.createTemperatureChart();
        this.loading = false;
      });
    } catch (error) {
      console.error("Error fetching UV impact data:", error);
      this.loading = false;
    }
  },
  methods: {
    createSkinCancerChart() {
      const ctx = this.$refs.skinCancerChart.getContext("2d");

      this.skinCancerChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.skinCancerData.map((item) => item.ageGroup),
          datasets: [
            {
              label: "Incidence Rate per 100,000",
              data: this.skinCancerData.map((item) => item.incidenceRate),
              backgroundColor: "rgba(255, 99, 132, 0.7)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Incidence Rate per 100,000",
              },
            },
            x: {
              title: {
                display: true,
                text: "Age Group",
              },
            },
          },
        },
      });
    },
    createTemperatureChart() {
      const ctx = this.$refs.temperatureChart.getContext("2d");

      this.temperatureChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.temperatureData.map((item) => item.year),
          datasets: [
            {
              label: "Average Temperature (°C)",
              data: this.temperatureData.map((item) => item.averageTemp),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 2,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Year",
              },
            },
          },
        },
      });
    },
  },
  beforeUnmount() {
    // Clean up charts when component is destroyed
    if (this.skinCancerChart) {
      this.skinCancerChart.destroy();
    }
    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }
  },
};
</script>

<style scoped>
.uv-impact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 30px;
  color: #555;
  line-height: 1.6;
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
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chart-wrapper {
  height: 300px;
  margin: 20px 0;
}

.chart-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.info-section {
  background-color: #e8f4f8;
  border-radius: 10px;
  padding: 25px;
  margin-top: 30px;
}

.fact-list {
  list-style-type: none;
  padding: 0;
}

.fact-list li {
  padding: 10px 0 10px 30px;
  position: relative;
}

.fact-list li:before {
  content: "•";
  color: #007bff;
  font-size: 1.5em;
  position: absolute;
  left: 10px;
  top: 5px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
