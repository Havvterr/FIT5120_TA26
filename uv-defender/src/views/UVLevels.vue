<template>
  <div class="uv-levels-container">
    <h1>Check UV Levels</h1>
    <p class="description">
      Enter a location or postcode to check the current UV index and get
      recommendations for sun protection.
    </p>

    <!-- Search Section -->
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          v-model="searchLocation"
          placeholder="Enter location or postcode (e.g., Clayton, Melbourne or 3800)"
          class="search-input"
          @input="handleLocationInput"
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

    <!-- Results Section (conditionally displayed) -->
    <div v-if="showResults" class="uv-results">
      <h2>UV Index for {{ location }}</h2>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading UV data...</p>
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else class="uv-info">
        <div class="uv-meter">
          <div class="uv-value" :style="{ backgroundColor: uvColor }">
            {{ uvIndex }}
          </div>
          <div class="uv-scale">
            <div class="scale-segment low">Low</div>
            <div class="scale-segment moderate">Moderate</div>
            <div class="scale-segment high">High</div>
            <div class="scale-segment very-high">Very High</div>
            <div class="scale-segment extreme">Extreme</div>
          </div>
        </div>

        <div class="uv-message">
          <h3>{{ uvMessage }}</h3>
          <p>{{ uvDescription }}</p>
        </div>

        <div class="protection-recommendations">
          <h3>Recommended Protection:</h3>
          <ul class="protection-list">
            <li v-if="uvIndex >= 3">
              <span class="icon">🧴</span> Apply SPF 30+ sunscreen
            </li>
            <li v-if="uvIndex >= 3"><span class="icon">👒</span> Wear a hat</li>
            <li v-if="uvIndex >= 5">
              <span class="icon">👕</span> Wear protective clothing
            </li>
            <li v-if="uvIndex >= 3">
              <span class="icon">🕶️</span> Wear sunglasses
            </li>
            <li v-if="uvIndex >= 8">
              <span class="icon">⛱️</span> Seek shade during peak hours
              (10am-4pm)
            </li>
            <li v-if="uvIndex >= 11">
              <span class="icon">🏠</span> Stay indoors if possible
            </li>
            <li v-if="uvIndex < 3">
              <span class="icon">✅</span> Minimal protection needed for short
              exposure
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="uv-info-section" v-if="!showResults">
      <h2>Understanding the UV Index</h2>
      <div class="uv-scale-info">
        <div class="uv-scale-item low">
          <h3>Low (0-2)</h3>
          <p>
            Low danger from the sun's UV rays for the average person. Wear
            sunglasses on bright days.
          </p>
        </div>
        <div class="uv-scale-item moderate">
          <h3>Moderate (3-5)</h3>
          <p>
            Moderate risk of harm from unprotected sun exposure. Stay in shade
            during midday hours, wear protective clothing, sunglasses, and
            sunscreen.
          </p>
        </div>
        <div class="uv-scale-item high">
          <h3>High (6-7)</h3>
          <p>
            High risk of harm from unprotected sun exposure. Protection against
            skin and eye damage is needed. Reduce time in the sun between 10
            a.m. and 4 p.m.
          </p>
        </div>
        <div class="uv-scale-item very-high">
          <h3>Very High (8-10)</h3>
          <p>
            Very high risk of harm from unprotected sun exposure. Take extra
            precautions because unprotected skin and eyes will be damaged and
            can burn quickly.
          </p>
        </div>
        <div class="uv-scale-item extreme">
          <h3>Extreme (11+)</h3>
          <p>
            Extreme risk of harm from unprotected sun exposure. Take all
            precautions because unprotected skin and eyes can burn in minutes.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchLocation: "",
      location: "",
      predictions: [],
      showResults: false,
      loading: false,
      error: null,
      uvIndex: null,
      uvMessage: "",
      uvDescription: "",
      coordinates: {
        lat: null,
        lng: null,
      },
    };
  },
  computed: {
    uvColor() {
      // Return a color based on the UV index value
      if (this.uvIndex < 3) {
        return "#3EA72D"; // Green for low
      } else if (this.uvIndex < 6) {
        return "#FFF300"; // Yellow for moderate
      } else if (this.uvIndex < 8) {
        return "#F18B00"; // Orange for high
      } else if (this.uvIndex < 11) {
        return "#E53210"; // Red for very high
      } else {
        return "#B567A4"; // Purple for extreme
      }
    },
  },
  methods: {
    async handleLocationInput() {
      if (this.searchLocation.length > 2) {
        try {
          const response = await axios.get(
            `/api/places/autocomplete?input=${encodeURIComponent(
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

    selectLocation(prediction) {
      this.searchLocation = prediction.description;
      this.predictions = [];
      this.searchUVLevel();
    },

    async searchUVLevel() {
      if (this.searchLocation.trim() === "") {
        alert("Please enter a valid location or postcode");
        return;
      }

      this.location = this.searchLocation;
      this.loading = true;
      this.showResults = true;
      this.error = null;

      try {
        // First get coordinates from the location
        const geoResponse = await axios.get(
          `/api/geocode/postcode?postcode=${encodeURIComponent(
            this.searchLocation
          )}`
        );

        this.coordinates = geoResponse.data;

        // Then get UV index from coordinates
        const uvResponse = await axios.get(
          `/api/uv-index?lat=${this.coordinates.lat}&lon=${this.coordinates.lng}`
        );

        this.uvIndex = uvResponse.data.uvIndex;
        this.setUVMessages();

        this.loading = false;
      } catch (err) {
        console.error("Error fetching UV data:", err);
        this.error = "Failed to fetch UV data. Please try again.";
        this.loading = false;
      }
    },

    async useCurrentLocation() {
      if (navigator.geolocation) {
        this.loading = true;
        this.showResults = true;
        this.error = null;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              this.coordinates = { lat: latitude, lng: longitude };

              // Get location name from coordinates (reverse geocoding)
              const reverseGeoResponse = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.VUE_APP_GOOGLE_MAPS_API_KEY}`
              );

              if (reverseGeoResponse.data.results.length > 0) {
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

              // Get UV index from coordinates
              const uvResponse = await axios.get(
                `/api/uv-index?lat=${latitude}&lon=${longitude}`
              );

              this.uvIndex = uvResponse.data.uvIndex;
              this.setUVMessages();

              this.loading = false;
            } catch (error) {
              console.error("Error fetching data:", error);
              this.error = "Failed to fetch UV data. Please try again.";
              this.loading = false;
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            this.error =
              "Unable to access your location. Please allow location access or enter a location manually.";
            this.loading = false;
          }
        );
      } else {
        this.error = "Geolocation is not supported by your browser.";
      }
    },

    setUVMessages() {
      // Set UV message and description based on the UV index value
      if (this.uvIndex < 3) {
        this.uvMessage = "Low UV Level";
        this.uvDescription =
          "Minimal sun protection required for most people. Wear sunglasses on bright days.";
      } else if (this.uvIndex < 6) {
        this.uvMessage = "Moderate UV Level";
        this.uvDescription =
          "Take precautions - cover up, wear a hat, sunglasses and sunscreen, especially if you will be outside for 30 minutes or more.";
      } else if (this.uvIndex < 8) {
        this.uvMessage = "High UV Level";
        this.uvDescription =
          "Protection required - UV damages skin and can cause sunburn. Reduce time in the sun between 10am and 4pm.";
      } else if (this.uvIndex < 11) {
        this.uvMessage = "Very High UV Level";
        this.uvDescription =
          "Extra protection required - unprotected skin can burn in minutes. Avoid being outside during midday hours.";
      } else {
        this.uvMessage = "Extreme UV Level";
        this.uvDescription =
          "Maximum protection required - avoid being outside during midday hours, shirt, hat, sunglasses and SPF 30+ sunscreen are essential.";
      }
    },
  },
};
</script>

<style scoped>
.uv-levels-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.search-container {
  position: relative;
  margin-bottom: 40px;
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
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0069d9;
}

.predictions-dropdown {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 0 0 4px 4px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.predictions-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.predictions-dropdown li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.predictions-dropdown li:hover {
  background-color: #f8f9fa;
}

.current-location {
  text-align: center;
  margin-top: 15px;
}

.location-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.location-button:hover {
  background-color: #5a6268;
}

.uv-results {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.uv-results h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
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
  color: #dc3545;
  text-align: center;
  padding: 20px;
}

.uv-meter {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.uv-value {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.uv-scale {
  display: flex;
  width: 100%;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.scale-segment {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.low {
  background-color: #3ea72d;
}

.moderate {
  background-color: #fff300;
  color: #333;
  text-shadow: none;
}

.high {
  background-color: #f18b00;
}

.very-high {
  background-color: #e53210;
}

.extreme {
  background-color: #b567a4;
}

.uv-message {
  text-align: center;
  margin-bottom: 30px;
}

.uv-message h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.protection-recommendations {
  background-color: #e8f4f8;
  border-radius: 8px;
  padding: 20px;
}

.protection-recommendations h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.protection-list {
  list-style-type: none;
  padding: 0;
}

.protection-list li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

.uv-info-section {
  margin-top: 40px;
}

.uv-info-section h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.uv-scale-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.uv-scale-item {
  padding: 15px;
  border-radius: 8px;
  color: white;
}

.uv-scale-item.moderate {
  color: #333;
}

.uv-scale-item h3 {
  margin-bottom: 10px;
}

@media (max-width: 576px) {
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

  .uv-scale {
    height: 30px;
  }

  .scale-segment {
    font-size: 0.6rem;
  }
}
</style>
