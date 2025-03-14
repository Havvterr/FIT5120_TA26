<template>
  <div>
    <h3>User Data Chart</h3>
    <canvas id="userChart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

export default {
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      // Register all Chart.js components, including scales, controllers, elements, and plugins
      Chart.register(...registerables);

      const ctx = document.getElementById("userChart").getContext("2d");
      new Chart(ctx, {
        type: "bar", // You can change this to 'line', 'pie', etc.
        data: {
          labels: ["User 1", "User 2", "User 3"], // Example labels
          datasets: [
            {
              label: "# of Users",
              data: [12, 19, 3], // Example data
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 600px;
  margin: 0 auto;
}
</style>
