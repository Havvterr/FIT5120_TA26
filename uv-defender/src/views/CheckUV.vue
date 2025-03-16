<!-- src/components/CheckUV.vue -->
<template>
  <div class="check-uv">
    <div class="content-container">
      <div class="white-box">
        <h1 class="display-4">UV Level Checker</h1>

        <!-- Input Section -->
        <div class="input-area">
          <label for="address-input">Enter your address:</label>
          <div class="address-search">
            <input
              id="address-input"
              type="text"
              v-model="address"
              placeholder="Enter an Australian address"
              @input="handleAddressInput"
            />
            <ul v-if="predictions.length > 0" class="predictions-list">
              <li
                v-for="prediction in predictions"
                :key="prediction.place_id"
                @click="selectAddress(prediction)"
              >
                {{ prediction.description }}
              </li>
            </ul>
          </div>
          <button @click="checkUVIndex">Check UV Index</button>
        </div>

        <!-- Use current location button -->
        <div class="location-area mt-3">
          <button @click="useCurrentLocation" class="btn btn-secondary">
            Use My Current Location
          </button>
        </div>

        <!-- Loading and Error States -->
        <div v-if="loading" class="status-area mt-3">
          <p>Loading...</p>
        </div>
        <div v-if="error" class="status-area mt-3 error">
          <p>{{ error }}</p>
        </div>

        <!-- UV Index Result Display -->
        <div
          v-if="!loading && !error && uvIndex !== null"
          class="result-area mt-5"
        >
          <h2 :style="{ color: uvColor }">Your UV Index: {{ uvIndex }}</h2>
          <p>{{ uvMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CheckUV",
  data() {
    return {
      address: "",
      predictions: [],
      uvIndex: null,
      uvMessage: "",
      loading: false,
      error: null,
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
    async handleAddressInput() {
      if (this.address.length > 2) {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/places/autocomplete?input=${encodeURIComponent(
              this.address
            )}`
          );
          this.predictions = response.data.predictions;
        } catch (error) {
          console.error("Error fetching predictions:", error);
        }
      } else {
        this.predictions = [];
      }
    },

    async selectAddress(prediction) {
      this.address = prediction.description;
      this.predictions = [];
      await this.checkUVIndex();
    },

    async checkUVIndex() {
      if (!this.address) {
        alert("Please enter an address.");
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        // Get coordinates from address
        const geoResponse = await axios.get(
          `http://localhost:3000/api/geocode/postcode?postcode=${encodeURIComponent(
            this.address
          )}`
        );
        const { lat, lng } = geoResponse.data;

        // Get UV index from coordinates
        const uvResponse = await axios.get(
          `http://localhost:3000/api/uv-index?lat=${lat}&lon=${lng}`
        );
        this.uvIndex = uvResponse.data.uvIndex;

        // Set UV message based on the UV index value
        if (this.uvIndex < 3) {
          this.uvMessage = "Low UV level. Minimal sun protection needed.";
        } else if (this.uvIndex < 6) {
          this.uvMessage =
            "Moderate UV level. Consider wearing sunglasses and sunscreen.";
        } else if (this.uvIndex < 8) {
          this.uvMessage =
            "High UV level. Wear a hat, sunglasses, and sunscreen.";
        } else if (this.uvIndex < 11) {
          this.uvMessage =
            "Very High UV level. Seek shade and use strong sunscreen.";
        } else {
          this.uvMessage =
            "Extreme UV level! Stay indoors or use maximum protection.";
        }
      } catch (error) {
        this.error = "Failed to fetch UV index. Please try again.";
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },
    useCurrentLocation() {
      if (navigator.geolocation) {
        this.loading = true;
        this.error = null;
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await axios.get(
                `http://localhost:3000/api/uv-index?lat=${latitude}&lon=${longitude}`
              );
              this.uvIndex = response.data.uvIndex;

              // Set UV message based on the UV index value
              if (this.uvIndex < 3) {
                this.uvMessage = "Low UV level. Minimal sun protection needed.";
              } else if (this.uvIndex < 6) {
                this.uvMessage =
                  "Moderate UV level. Consider wearing sunglasses and sunscreen.";
              } else if (this.uvIndex < 8) {
                this.uvMessage =
                  "High UV level. Wear a hat, sunglasses, and sunscreen.";
              } else if (this.uvIndex < 11) {
                this.uvMessage =
                  "Very High UV level. Seek shade and use strong sunscreen.";
              } else {
                this.uvMessage =
                  "Extreme UV level! Stay indoors or use maximum protection.";
              }
            } catch (error) {
              this.error = "Failed to fetch UV index. Please try again.";
              console.error("Error:", error);
            } finally {
              this.loading = false;
            }
          },
          () => {
            this.error = "Unable to retrieve your location.";
            this.loading = false;
          }
        );
      } else {
        this.error = "Geolocation is not supported by your browser.";
      }
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
}

.white-box {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.display-4 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
}

.input-area {
  margin-bottom: 20px;
}

.input-area input {
  padding: 10px;
  font-size: 1rem;
  margin-right: 10px;
  width: 300px;
  text-align: left;
}

.address-search {
  position: relative;
  display: inline-block;
}

.predictions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
}

.predictions-list li {
  padding: 10px;
  cursor: pointer;
  text-align: left;
}

.predictions-list li:hover {
  background-color: #f5f5f5;
}

.input-area button,
.location-area button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
}

.result-area h2 {
  font-size: 2rem;
  margin-top: 20px;
}

.result-area p {
  font-size: 1.2rem;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-5 {
  margin-top: 2rem;
}
</style>
