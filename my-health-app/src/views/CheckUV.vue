<!-- src/components/CheckUV.vue -->
<template>
  <div class="check-uv">
    <div class="content-container">
      <div class="white-box">
        <h1 class="display-4">UV Level Checker</h1>

        <!-- Input Section -->
        <div class="input-area">
          <label for="pincode-input">Enter your postcode or suburb:</label>
          <div class="search-container">
            <input
              id="pincode-input"
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="e.g. 3000 or Melbourne"
            />
            <div v-if="searchResults.length > 0" class="search-results">
              <div
                v-for="result in searchResults"
                :key="result.postcode"
                class="search-item"
                @click="selectLocation(result)"
              >
                {{ result.suburb }}, {{ result.state }} ({{ result.postcode }})
              </div>
            </div>
          </div>
          <button @click="checkUVIndex">Check UV Index</button>
        </div>

        <!-- Use current location button -->
        <div class="location-area mt-3">
          <button @click="useCurrentLocation" class="btn btn-secondary">
            Use My Current Location
          </button>
        </div>

        <!-- UV Index Result Display -->
        <div v-if="uvIndex !== null" class="result-area mt-5">
          <h2 :style="{ color: uvColor }">Your UV Index: {{ uvIndex }}</h2>
          <p>{{ uvMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckUV",
  data() {
    return {
      pincode: "",
      searchQuery: "",
      searchResults: [],
      uvIndex: null,
      uvMessage: "",
    };
  },
  computed: {
    uvColor() {
      // Return a color based on the UV index value:
      // Blue for fine (<3), black for moderate (3-5), red for high (6+)
      if (this.uvIndex < 3) {
        return "blue";
      } else if (this.uvIndex < 6) {
        return "black";
      } else {
        return "red";
      }
    },
  },
  methods: {
    async handleSearch() {
      if (this.searchQuery.length < 2) {
        this.searchResults = [];
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/search-location?query=${encodeURIComponent(
            this.searchQuery
          )}`
        );
        const data = await response.json();
        this.searchResults = data.results;
      } catch (error) {
        console.error("Error searching locations:", error);
      }
    },

    selectLocation(location) {
      this.pincode = location.postcode;
      this.searchQuery = `${location.suburb}, ${location.state} (${location.postcode})`;
      this.searchResults = [];
    },

    async checkUVIndex() {
      // Validate that the pincode is exactly 4 digits
      if (!/^\d{4}$/.test(this.pincode)) {
        alert("Please enter a 4-digit Australian postcode (0200-9999).");
        return;
      }
      // Convert to number and check if it is within the valid range
      const numericPin = parseInt(this.pincode, 10);
      if (numericPin < 200 || numericPin > 9999) {
        alert("Postcode must be between 0200 and 9999.");
        return;
      }

      try {
        const response = await fetch(`
          http://localhost:3000/api/uv-index/${this.pincode}
        `);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch UV index");
        }

        this.uvIndex = data.uvIndex;
        this.uvMessage = data.message;
      } catch (error) {
        console.error("Error fetching UV index:", error);
        alert("Failed to fetch UV index. Please try again later.");
      }
    },
    useCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            // We don't need to use the position data, so no parameter is needed.
            this.reverseGeocode();
          },
          () => {
            alert("Unable to retrieve your location.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    },
    async reverseGeocode() {
      /*
          In a real application, you would use a reverse-geocoding API
          to convert latitude/longitude to a postal code.
        */
      // For demonstration, assume the location corresponds to postcode "3000"
      this.pincode = "3000";
      this.checkUVIndex();
    },
  },
};
</script>

<style scoped>
.check-uv {
  height: 100vh;
  width: 100%;
  background: url("@/assets/uv_defender.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  animation: fadeIn 0.5s ease-in-out;
}

.white-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.white-box:hover {
  transform: translateY(-5px);
}

.display-4 {
  font-size: 2.8rem;
  margin-bottom: 30px;
  color: #2c3e50;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.input-area {
  margin-bottom: 30px;
}

.input-area label {
  display: block;
  margin-bottom: 12px;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 500;
}

.search-container {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

.search-container input {
  width: 100%;
  padding: 15px 20px;
  font-size: 1.1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-container input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  animation: slideDown 0.3s ease-out;
}

.search-item {
  padding: 12px 20px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.search-item:last-child {
  border-bottom: none;
}

.search-item:hover {
  background-color: #f8f9fa;
}

.input-area button,
.location-area button {
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.input-area button:hover,
.location-area button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.25);
}

.btn-secondary {
  background-color: #95a5a6 !important;
  margin-top: 15px;
}

.btn-secondary:hover {
  background-color: #7f8c8d !important;
}

.result-area {
  margin-top: 40px;
  padding: 20px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.result-area h2 {
  font-size: 2.2rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.result-area p {
  font-size: 1.2rem;
  color: #2c3e50;
  line-height: 1.6;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .content-container {
    padding: 15px;
  }

  .white-box {
    padding: 25px;
  }

  .display-4 {
    font-size: 2.2rem;
  }

  .search-container {
    max-width: 100%;
  }

  .input-area button,
  .location-area button {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
