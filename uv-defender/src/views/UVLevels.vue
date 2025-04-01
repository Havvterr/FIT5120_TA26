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

    <!-- Results Section (conditionally displayed) -->
    <div v-if="showResults" class="uv-results">
      <h2>UV Index for {{ location }}</h2>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading UV data...</p>
      </div>

      <div v-else-if="error" class="error">
        <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
        <p>{{ error }}</p>
        <button @click="retrySearch" class="retry-button">Retry</button>
      </div>

      <div v-else class="uv-info">
        <div class="uv-meter">
          <div class="uv-value" :style="{ backgroundColor: uvColor }">
            {{ Number(uvIndex).toFixed(1) }}
          </div>
          <div class="uv-scale">
            <div class="scale-segment low">Low</div>
            <div class="scale-segment moderate">Moderate</div>
            <div class="scale-segment high">High</div>
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
              <span class="icon"><i class="fas fa-pump-medical"></i></span>
              Apply sunscreen
            </li>
            <li v-if="uvIndex >= 3">
              <span class="icon"><i class="fas fa-hat-cowboy"></i></span> Wear a
              hat
            </li>
            <li v-if="uvIndex >= 5">
              <span class="icon"><i class="fas fa-tshirt"></i></span> Wear
              protective clothing
            </li>
            <li v-if="uvIndex >= 3">
              <span class="icon"><i class="fas fa-glasses"></i></span> Wear
              sunglasses
            </li>
            <li v-if="uvIndex >= 10">
              <span class="icon"><i class="fas fa-umbrella-beach"></i></span>
              Seek shade during peak hours
            </li>
            <li v-if="uvIndex >= 10">
              <span class="icon"><i class="fas fa-home"></i></span> Stay indoors
              if possible
            </li>
            <li v-if="uvIndex < 3">
              <span class="icon"><i class="fas fa-check"></i></span> Minimal
              protection needed for short exposure
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
          <p>Low danger from the sun's UV rays for the average person.</p>
        </div>
        <div class="uv-scale-item moderate">
          <h3>Moderate (3-5)</h3>
          <p>
            Moderate risk of harm from unprotected sun exposure. Wear protective
            clothing, sunglasses, and sunscreen.
          </p>
        </div>
        <div class="uv-scale-item high">
          <h3>High (6-10)</h3>
          <p>
            High risk of harm from unprotected sun exposure. Protection against
            skin and eye damage is needed. Try to avoid exposure outdoors the
            hours of strongest sunlight, from 10 AM to 4 PM.
          </p>
        </div>
        <div class="uv-scale-item extreme">
          <h3>Extreme (10+)</h3>
          <p>
            Extreme risk of harm from unprotected sun exposure. Avoid being
            outside during midday hours.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // Import the API instance

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
      uvMaxToday: null,
      sunInfo: null,
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
      // Return a color based on the UV index value (4 levels)
      if (this.uvIndex < 3) {
        return "#3EA72D"; // Green for low
      } else if (this.uvIndex < 6) {
        return "#FFF300"; // Yellow for moderate
      } else if (this.uvIndex < 10) {
        return "#F18B00"; // Orange for high
      } else {
        return "#E53210"; // Red for extreme
      }
    },
  },
  methods: {
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

        // Use the new fetchUVData method to get UV data
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
              console.log("Location coordinates:", latitude, longitude);

              // Get location name from coordinates (reverse geocoding)
              try {
                // Use server-side proxy API instead of calling Google API directly
                const reverseGeoResponse = await api.get(
                  `/geocode/reverse?lat=${latitude}&lng=${longitude}`
                );
                console.log(
                  "Reverse geocoding response:",
                  reverseGeoResponse.data
                );

                // If server-side reverse geocoding API is not implemented, use default location name
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

              // Use the new fetchUVData method to get UV data
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

    setUVMessages() {
      // Set UV message and description based on the UV index value (4 levels)
      if (this.uvIndex < 3) {
        this.uvMessage = "Low UV Level";
        this.uvDescription =
          "Minimal sun protection required for most people. Wear sunglasses on bright days.";
      } else if (this.uvIndex < 6) {
        this.uvMessage = "Moderate UV Level";
        this.uvDescription =
          "Take precautions - cover up, wear a hat, sunglasses and sunscreen, especially if you will be outside for 30 minutes or more.";
      } else if (this.uvIndex < 11) {
        this.uvMessage = "High UV Level";
        this.uvDescription =
          "Protection required - UV damages skin and can cause sunburn. Reduce time in the sun between 10am and 4pm. Apply SPF 30+ sunscreen every 2 hours.";
      } else {
        this.uvMessage = "Extreme UV Level";
        this.uvDescription =
          "Maximum protection required - avoid being outside during midday hours, shirt, hat, sunglasses and SPF 30+ sunscreen are essential.";
      }
    },

    retrySearch() {
      this.error = null;
      if (this.coordinates.lat && this.coordinates.lng) {
        // If we already have coordinates, directly retry fetching UV data
        this.loading = true;
        this.fetchUVData(this.coordinates.lat, this.coordinates.lng);
      } else if (this.searchLocation) {
        // If we have a search location, retry the search
        this.searchUVLevel();
      } else {
        // If we have neither, prompt the user to enter a location
        this.error = "Please enter a location or use current location";
      }
    },

    // Add a new method to fetch UV data, avoid code duplication
    async fetchUVData(lat, lng) {
      try {
        console.log(`Requesting UV index data for lat=${lat}, lon=${lng}`);
        const uvResponse = await api.get(`/uv-index?lat=${lat}&lon=${lng}`);
        console.log("UV index response:", uvResponse.data);

        // Handle response from OpenUV API
        if (uvResponse.data.uvIndex !== undefined) {
          this.uvIndex = uvResponse.data.uvIndex;

          // Check if we have additional data from OpenUV
          if (!uvResponse.data.isBackupData) {
            this.uvMaxToday = uvResponse.data.uvMaxToday;
            this.sunInfo = uvResponse.data.sunInfo;
          } else {
            // Reset additional fields if using backup data
            this.uvMaxToday = null;
            this.sunInfo = null;
          }

          this.setUVMessages();
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

        // Log detailed error information
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });

        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.uv-levels-container {
  max-width: 780px;
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
  background-color: #4d5966;
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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  margin-top: 15px;
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
  background-color: #f8d7da;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-icon {
  margin-bottom: 10px;
  font-size: 2rem;
  color: #dc3545;
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
}

.retry-button:hover {
  background-color: #0069d9;
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
  background-color: #4abe2a;
}

.moderate {
  background-color: #d5cc25;
  color: #333;
  text-shadow: none;
}

.high {
  background-color: #e46115;
}

.extreme {
  background-color: #f24623;
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
  width: 25px;
  text-align: center;
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
  gap: 11px;
}

.uv-scale-item {
  padding: 18px;
  border-radius: 8px;
  color: white;
  margin-bottom: 5px;
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
    border-radius: 5px;
    width: 100%;
  }

  .uv-scale {
    height: 30px;
  }
}
</style>
