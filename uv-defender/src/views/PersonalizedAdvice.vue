<template>
  <div class="personalized-advice-container">
    <h1>Personalized Sun Protection Advice</h1>

    <div class="skin-type-selector">
      <h2>Select Your Skin Type</h2>
      <p class="instruction">Move the slider to select your skin type</p>

      <div class="slider-container">
        <input
          type="range"
          min="1"
          max="6"
          v-model="selectedSkinType"
          class="skin-type-slider"
          @change="updateSkinType"
        />
        <div class="skin-type-labels">
          <span>I</span>
          <span>II</span>
          <span>III</span>
          <span>IV</span>
          <span>V</span>
          <span>VI</span>
        </div>
      </div>

      <div class="skin-type-description">
        <h3>Skin Type {{ selectedSkinType }}</h3>
        <p>{{ skinTypeDescriptions[selectedSkinType - 1] }}</p>
      </div>
    </div>

    <div class="uv-query-section">
      <h2>Check Current UV Index</h2>
      <div class="search-container">
        <div class="search-box">
          <input
            type="text"
            v-model="searchLocation"
            placeholder="Enter location or postcode (e.g., Clayton VIC, Australia or 3800)"
            class="search-input"
            @input="locationInput"
          />
          <button @click="searchUVLevel" class="search-button">Search</button>
        </div>

        <!-- Predictions dropdown -->
        <div v-if="predictions.length > 0" class="predictions-dropdown">
          <ul>
            <li
              v-for="prediction in predictions"
              :key="prediction.place_id"
              @click="selectLocation(prediction)"
            >
              {{ prediction.description }}
            </li>
          </ul>
        </div>

        <!-- Current location button -->
        <div class="current-location">
          <button @click="useCurrentLocation" class="location-button">
            Use My Current Location
          </button>
        </div>
      </div>

      <div v-if="currentUVIndex !== null" class="uv-result">
        <p>
          Current UV Index at {{ location }}:
          <span class="uv-value" :style="{ backgroundColor: uvColor }">
            {{ Number(currentUVIndex).toFixed(1) }}
          </span>
        </p>
      </div>
    </div>

    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Generating your personalized advice...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="getSkinAdvice" class="retry-button">Retry</button>
    </div>

    <div v-if="advice && !loading" class="advice-container">
      <h2>Your Personalized Sun Protection Plan</h2>

      <div class="advice-card">
        <div class="card-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="card-content">
          <h3>Sun Protection Advice</h3>
          <p>{{ advice.adviceText }}</p>
          <p v-if="advice.additionalInfo" class="additional-info">
            {{ advice.additionalInfo }}
          </p>
        </div>
      </div>

      <div
        v-if="currentUVIndex > 0"
        class="advice-card sunscreen-recommendation"
      >
        <div class="card-icon">
          <i class="fas fa-pump-soap"></i>
        </div>
        <div class="card-content">
          <h3>Recommended Sunscreen Amount</h3>
          <p>
            Based on your skin type and current UV index ({{ currentUVIndex }}):
          </p>
          <div class="sunscreen-amount">
            <span class="amount"
              >{{ calculateSunscreenAmount() }} teaspoons</span
            >
          </div>
          <p class="reapplication">
            Reapply every {{ calculateReapplicationTime() }} hours when
            outdoors.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // Import the API instance

export default {
  name: "PersonalizedAdvice",
  data() {
    return {
      selectedSkinType: 3, // Default to medium skin tone
      currentUVIndex: null, // Initial null indicates not queried yet
      searchLocation: "", // User input location search
      location: "", // Resolved location name
      predictions: [], // Location predictions
      advice: null,
      loading: false,
      error: null,
      coordinates: {
        lat: null,
        lng: null,
      },
      skinTypeDescriptions: [
        "Extremely light skin, often appearing creamy. Burns very easily, rarely tans.",
        "Fair skin with slight pink or yellow undertones. Burns easily, tans minimally.",
        "Light brown skin with yellow or olive undertones. Sometimes burns, gradually tans.",
        "Moderate brown skin. Burns minimally, tans well.",
        "Dark brown skin. Rarely burns, tans profusely.",
        "Darkest brown skin. Never burns, deeply pigmented.",
      ],
    };
  },
  computed: {
    uvColor() {
      // Return a color based on the UV index value (4 levels)
      if (this.currentUVIndex < 3) {
        return "#3EA72D"; // Green for low
      } else if (this.currentUVIndex < 6) {
        return "#FFF300"; // Yellow for moderate
      } else if (this.currentUVIndex < 10) {
        return "#F18B00"; // Orange for high
      } else {
        return "#E53210"; // Red for extreme
      }
    },
  },
  methods: {
    // Update skin type and fetch advice if UV index is already available
    updateSkinType() {
      // If we already have UV index, get advice
      if (this.currentUVIndex !== null) {
        this.getSkinAdvice();
      }
    },

    // Handle location input for autocomplete
    async locationInput() {
      if (this.searchLocation.length > 2) {
        try {
          const response = await api.get(
            `/places/autocomplete?input=${encodeURIComponent(
              this.searchLocation
            )}`
          );
          this.predictions = response.data.predictions;
        } catch (error) {
          console.error("Error fetching predictions:", error);
          this.predictions = [];
        }
      } else {
        this.predictions = [];
      }
    },

    // Select location from autocomplete predictions
    selectLocation(prediction) {
      this.searchLocation = prediction.description;
      this.predictions = [];
      this.searchUVLevel();
    },

    // Search for UV level based on entered location
    async searchUVLevel() {
      if (this.searchLocation.trim() === "") {
        this.error = "Please enter a valid location or postcode";
        return;
      }

      this.location = this.searchLocation;
      this.loading = true;
      this.error = null;

      try {
        // First get coordinates from the location
        const geoResponse = await api.get(
          `/geocode/postcode?postcode=${encodeURIComponent(
            this.searchLocation
          )}`
        );

        this.coordinates = geoResponse.data;
        console.log(
          "Location coordinates:",
          this.coordinates.lat,
          this.coordinates.lng
        );

        // Fetch UV data using coordinates
        await this.fetchUVData(this.coordinates.lat, this.coordinates.lng);
      } catch (err) {
        console.error("Error fetching data:", err);

        if (err.response?.status === 404) {
          this.error =
            "Location not found. Please try a more specific location name or postcode.";
        } else {
          this.error = "Failed to fetch location data. Please try again.";
        }

        this.loading = false;
      }
    },

    // Use current location to get UV data
    async useCurrentLocation() {
      if (navigator.geolocation) {
        this.loading = true;
        this.error = null;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              this.coordinates = { lat: latitude, lng: longitude };
              console.log("Location coordinates:", latitude, longitude);

              // Get location name from coordinates (reverse geocoding)
              try {
                const reverseGeoResponse = await api.get(
                  `/geocode/reverse?lat=${latitude}&lng=${longitude}`
                );
                console.log(
                  "Reverse geocoding response:",
                  reverseGeoResponse.data
                );

                if (
                  reverseGeoResponse.data &&
                  reverseGeoResponse.data.results &&
                  reverseGeoResponse.data.results.length > 0
                ) {
                  // Get a readable location name from the results
                  const addressComponents =
                    reverseGeoResponse.data.results[0].address_components;
                  const locality = addressComponents.find((component) =>
                    component.types.includes("locality")
                  );
                  const sublocality = addressComponents.find((component) =>
                    component.types.includes("sublocality")
                  );

                  this.location = locality
                    ? locality.long_name
                    : sublocality
                    ? sublocality.long_name
                    : "Your Location";
                } else {
                  this.location = "Your Location";
                }
              } catch (geoError) {
                console.error("Reverse geocoding error:", geoError);
                this.location = "Your Location";
                // Continue to get UV index even if geocoding fails
              }

              // Fetch UV data using coordinates
              await this.fetchUVData(latitude, longitude);
            } catch (error) {
              console.error(
                "Error fetching data:",
                error.response?.data || error.message
              );
              this.error = "Failed to fetch UV data. Please try again.";
              this.loading = false;
            }
          },
          (error) => {
            console.error("Geolocation error:", error.code, error.message);
            let errorMsg = "Unable to access your location. ";

            // Provide more specific error message based on error code
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMsg += "Please allow location access.";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMsg += "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                errorMsg += "Location request timed out.";
                break;
              default:
                errorMsg += "Please enter a location manually.";
            }

            this.error = errorMsg;
            this.loading = false;
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        this.error = "Geolocation is not supported by your browser.";
      }
    },

    // Fetch UV data using coordinates
    async fetchUVData(lat, lng) {
      try {
        console.log(`Requesting UV index data for lat=${lat}, lon=${lng}`);
        const uvResponse = await api.get(`/uv-index?lat=${lat}&lon=${lng}`);
        console.log("UV index response:", uvResponse.data);

        // Handle response from UV API
        if (uvResponse.data.uvIndex !== undefined) {
          this.currentUVIndex = Math.round(uvResponse.data.uvIndex);

          // Get skin advice once we have UV index
          this.getSkinAdvice();
        } else {
          throw new Error("Invalid response format");
        }

        this.loading = false;
      } catch (err) {
        console.error("Error fetching UV data:", err);

        // Enhanced error handling
        if (err.code === "ECONNABORTED" || err.message.includes("timeout")) {
          this.error =
            "Request timed out. Server might be busy, please try again.";
        } else if (err.response?.status === 404) {
          this.error =
            "API endpoint not found. Please check server configuration.";
        } else if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          this.error =
            "Invalid or expired API key. Please contact administrator to update the API key.";
        } else {
          this.error =
            "Failed to fetch UV data. Please check your network connection and try again.";
        }

        this.loading = false;
      }
    },

    async getSkinAdvice() {
      if (this.currentUVIndex === null) {
        this.error = "Please check the UV index first";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Fetch advice data from database
        const response = await api.get(
          `/personalized-advice?skinType=${this.selectedSkinType}&uvIndex=${this.currentUVIndex}`
        );

        // Update advice data
        this.advice = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching advice from database:", error);

        // If there's a fallback advice in the error response, use it
        if (
          error.response &&
          error.response.data &&
          error.response.data.fallbackAdvice
        ) {
          this.advice = {
            adviceText: error.response.data.fallbackAdvice,
            skinType: this.selectedSkinType,
            uvIndex: this.currentUVIndex,
          };
          this.loading = false;
        } else {
          this.error =
            "Unable to retrieve advice from database. Please try again later.";
          this.loading = false;
        }
      }
    },

    calculateSunscreenAmount() {
      // Calculate recommended sunscreen amount based on UV index and skin type
      let amount = 2; // Default amount

      // Skip calculation if UV index is 0
      if (this.currentUVIndex === 0) {
        return 0;
      }

      // Determine UV level
      let uvLevel = "low";
      if (this.currentUVIndex >= 8) {
        uvLevel = "high";
      } else if (this.currentUVIndex >= 3) {
        uvLevel = "medium";
      }

      // Adjust based on skin type and UV level
      if (uvLevel === "high") {
        if (this.selectedSkinType <= 2) {
          amount = 3;
        } else if (this.selectedSkinType <= 4) {
          amount = 2.5;
        } else {
          amount = 2;
        }
      } else if (uvLevel === "medium") {
        if (this.selectedSkinType <= 2) {
          amount = 2.5;
        } else if (this.selectedSkinType <= 4) {
          amount = 2;
        } else {
          amount = 1.5;
        }
      } else {
        // low
        if (this.selectedSkinType <= 2) {
          amount = 2;
        } else if (this.selectedSkinType <= 4) {
          amount = 1.5;
        } else {
          amount = 1;
        }
      }

      return amount;
    },

    calculateReapplicationTime() {
      // Calculate reapplication time based on UV index and skin type
      let hours = 2; // Default reapplication time

      // Skip calculation if UV index is 0
      if (this.currentUVIndex === 0) {
        return 0;
      }

      // Determine UV level
      let uvLevel = "low";
      if (this.currentUVIndex >= 8) {
        uvLevel = "high";
      } else if (this.currentUVIndex >= 3) {
        uvLevel = "medium";
      }

      // Adjust based on skin type and UV level
      if (uvLevel === "high") {
        if (this.selectedSkinType <= 2) {
          hours = 1;
        } else if (this.selectedSkinType <= 4) {
          hours = 1.5;
        } else {
          hours = 2;
        }
      } else if (uvLevel === "medium") {
        if (this.selectedSkinType <= 2) {
          hours = 1.5;
        } else if (this.selectedSkinType <= 4) {
          hours = 2;
        } else {
          hours = 2.5;
        }
      } else {
        // low
        if (this.selectedSkinType <= 2) {
          hours = 2;
        } else if (this.selectedSkinType <= 4) {
          hours = 2.5;
        } else {
          hours = 3;
        }
      }

      return hours;
    },
  },
  mounted() {
    // Don't automatically get advice on mount, wait for user to search
  },
};
</script>

<style scoped>
.personalized-advice-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: "Poppins", sans-serif;
  color: #333;
}

h1 {
  color: #2467af;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 600;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 500;
}

h3 {
  color: #2467af;
  margin-bottom: 15px;
  font-size: 1.4rem;
  font-weight: 500;
}

.skin-type-selector {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.instruction {
  color: #6c757d;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.slider-container {
  margin: 30px 0;
}

.skin-type-slider {
  width: 100%;
  height: 12px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    #ffe0bd,
    #e9be7f,
    #d49e57,
    #aa6d2c,
    #884b16,
    #5d4037
  );
  outline: none;
  border-radius: 6px;
  cursor: pointer;
}

.skin-type-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #2467af;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.skin-type-labels {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  font-weight: 500;
  color: #495057;
}

.skin-type-description {
  margin-top: 25px;
  padding: 20px;
  background-color: #e8f4f8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.uv-query-section {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  margin-bottom: 10px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.search-button {
  padding: 12px 20px;
  background-color: #2467af;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #1a4f8a;
}

.location-button {
  width: 100%;
  padding: 10px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.location-button:hover {
  background-color: #5a6268;
}

.predictions-dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.predictions-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.predictions-dropdown li {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.predictions-dropdown li:hover {
  background-color: #f8f9fa;
}

.predictions-dropdown li:last-child {
  border-bottom: none;
}

.uv-result {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f4f8;
  border-radius: 8px;
  text-align: center;
}

.uv-value {
  display: inline-block;
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  background-color: #2467af;
  padding: 10px 15px;
  border-radius: 50%;
  margin: 0 5px;
}

.advice-container {
  margin-top: 40px;
}

.advice-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.advice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 2rem;
  margin-right: 20px;
  color: #2467af;
  min-width: 40px;
  text-align: center;
}

.card-content {
  flex: 1;
}

.card-icon {
  color: #2467af;
}

.sunscreen-recommendation .card-icon {
  color: #3498db;
}

.sunscreen-amount {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2467af;
  margin: 20px 0;
  text-align: center;
}

.reapplication {
  font-style: italic;
  color: #6c757d;
  margin-top: 15px;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #2467af;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
  text-align: center;
}

.retry-button {
  background-color: #2467af;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #1a4f8a;
}

@media (max-width: 768px) {
  .advice-card {
    flex-direction: column;
  }

  .card-icon {
    margin-right: 0;
    margin-bottom: 15px;
    font-size: 1.8rem;
  }

  .skin-type-slider::-webkit-slider-thumb {
    width: 20px;
    height: 20px;
  }

  .search-box {
    flex-direction: column;
  }

  .search-input {
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .search-button {
    border-radius: 4px;
    width: 100%;
  }
}

.additional-info {
  font-style: italic;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #f0f7ff;
  border-radius: 6px;
  border-left: 3px solid #2467af;
}
</style>
