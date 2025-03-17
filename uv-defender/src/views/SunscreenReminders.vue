<template>
  <div class="sunscreen-reminders-container">
    <h1>Sunscreen Reminders</h1>
    <p class="description">
      Set up reminders to reapply sunscreen at your preferred intervals.
    </p>

    <div class="reminder-form">
      <!-- UV Index section with prompt -->
      <div class="uv-section">
        <p class="uv-prompt">
          Get the UV index for your location to receive a recommended
          reapplication interval.
        </p>

        <div class="form-group">
          <label for="location">Your Location:</label>
          <div class="location-input">
            <input
              type="text"
              id="location"
              v-model="searchLocation"
              placeholder="Enter location or postcode"
              class="form-control"
              @input="locationInput"
              :disabled="loading"
            />
            <button
              @click="getCurrentUV"
              class="btn btn-primary"
              :disabled="loading"
            >
              <span
                v-if="loading"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              {{ loading ? "Loading..." : "Get UV Index" }}
            </button>
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

          <button
            @click="useCurrentLocation"
            class="btn btn-secondary location-btn"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            {{ loading ? "Getting Location..." : "Use My Current Location" }}
          </button>
        </div>

        <!-- Loading indicator -->
        <div v-if="loading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Fetching UV data...</p>
        </div>

        <!-- Error message -->
        <div v-if="error" class="error-message">
          <i class="error-icon">⚠️</i>
          <p>{{ error }}</p>
        </div>

        <!-- Current UV display -->
        <div v-if="currentUVIndex !== null && !loading" class="current-uv">
          <h3>
            Current UV Index:
            <span :style="{ color: getUVColor() }">{{
              Number(currentUVIndex).toFixed(1)
            }}</span>
          </h3>
          <p>{{ getUVMessage() }}</p>

          <div class="recommendation-box">
            <h3>Recommended Reapplication</h3>
            <p>
              Based on the current UV index ({{
                Number(currentUVIndex).toFixed(1)
              }}), we recommend reapplying sunscreen every
              <strong>{{ recommendedInterval }} hours</strong> when outdoors.
            </p>
            <button
              @click="applyRecommendation"
              class="btn btn-outline-primary apply-btn"
            >
              Apply This Recommendation
            </button>
          </div>
        </div>
      </div>

      <!-- Application Time - Moved below UV section -->
      <div class="form-group">
        <label>Application Time:</label>
        <div class="time-options">
          <button
            @click="useCurrentTime"
            class="btn btn-primary"
            :disabled="loading"
          >
            Start Now
          </button>
          <span class="or-text">or</span>
          <input
            type="time"
            v-model="applicationTime"
            class="form-control time-input"
            :disabled="loading"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="reapplication-interval"
          >Reapplication Interval (hours):</label
        >
        <input
          type="number"
          id="reapplication-interval"
          v-model.number="manualReapplicationInterval"
          min="0.5"
          max="8"
          step="0.5"
          class="form-control"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <button
          @click="setReminder"
          class="btn btn-success save-btn"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? "Processing..." : "Save Reminder" }}
        </button>
      </div>
    </div>

    <div v-if="reminderSet" class="reminder-summary">
      <h2>Your Sunscreen Reminder</h2>
      <div class="reminder-details">
        <p><strong>Applied At:</strong> {{ formattedApplicationTime }}</p>
        <p v-if="currentUVIndex !== null">
          <strong>Current UV Index:</strong>
          {{ Number(currentUVIndex).toFixed(1) }}
        </p>
        <p><strong>Reapply At:</strong> {{ formattedReapplicationTime }}</p>
        <p>
          <strong>Reapplication Interval:</strong>
          {{ manualReapplicationInterval }} hours
        </p>
      </div>

      <div class="reminder-actions">
        <button @click="setCalendarReminder" class="btn btn-primary">
          Add to Calendar
        </button>
        <button @click="resetForm" class="btn btn-secondary">
          Set New Reminder
        </button>
      </div>
    </div>

    <div class="tips-section">
      <h2>Sunscreen Application Tips</h2>
      <ul class="tips-list">
        <li>Apply sunscreen 15-30 minutes before going outside.</li>
        <li>Use approximately 1 teaspoon for your face and neck.</li>
        <li>Use approximately 1 teaspoon for each arm and leg.</li>
        <li>Use approximately 1 teaspoon for your back.</li>
        <li>Reapply after swimming.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "@/api"; // Import the API instance

export default {
  name: "SunscreenReminders",
  data() {
    return {
      searchLocation: "",
      location: "",
      predictions: [],
      coordinates: {
        lat: null,
        lng: null,
      },
      applicationTime: "",
      currentUVIndex: null,
      manualReapplicationInterval: 2,
      recommendedInterval: 2,
      reapplicationTime: null,
      reminderSet: false,
      loading: false,
      error: null,
    };
  },
  computed: {
    isFormValid() {
      return this.applicationTime && this.manualReapplicationInterval > 0;
    },
    formattedApplicationTime() {
      if (!this.applicationTime) return "";

      // Convert 24-hour format to 12-hour format
      const timeParts = this.applicationTime.split(":");
      let hours = parseInt(timeParts[0]);
      const minutes = timeParts[1];
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12

      return `${hours}:${minutes} ${ampm}`;
    },
    formattedReapplicationTime() {
      if (!this.reapplicationTime) return "";

      const hours = this.reapplicationTime.getHours();
      const minutes = this.reapplicationTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

      return `${displayHours}:${displayMinutes} ${ampm}`;
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
      this.location = prediction.description;
      this.predictions = [];
      this.getCurrentUV();
    },

    async getCurrentUV() {
      if (this.searchLocation.trim() === "") {
        alert("Please enter a valid location or postcode");
        return;
      }

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

        // Fetch UV data
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
        this.error = null;

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              this.coordinates = { lat: latitude, lng: longitude };

              // Get location name from coordinates (reverse geocoding)
              try {
                const reverseGeoResponse = await api.get(
                  `/geocode/reverse?lat=${latitude}&lng=${longitude}`
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

                  this.searchLocation = this.location;
                } else {
                  this.location = "Your Location";
                  this.searchLocation = "Your Location";
                }
              } catch (geoError) {
                console.error("Reverse geocoding error:", geoError);
                this.location = "Your Location";
                this.searchLocation = "Your Location";
              }

              // Fetch UV data
              await this.fetchUVData(latitude, longitude);
            } catch (error) {
              console.error("Error fetching data:", error);
              this.error = "Failed to fetch UV data. Please try again.";
              this.loading = false;
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            let errorMsg = "Unable to access your location. ";

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

    async fetchUVData(lat, lng) {
      try {
        console.log(`Requesting UV index data for lat=${lat}, lon=${lng}`);
        const uvResponse = await api.get(`/uv-index?lat=${lat}&lon=${lng}`);
        console.log("UV index response:", uvResponse.data);

        // Handle response from UV API
        if (uvResponse.data.uvIndex !== undefined) {
          this.currentUVIndex = uvResponse.data.uvIndex;
          this.calculateRecommendedInterval();
        } else {
          throw new Error("Invalid response format");
        }

        this.loading = false;
      } catch (err) {
        console.error("Error fetching UV data:", err);
        this.error = "Failed to fetch UV data. Please try again.";
        this.loading = false;
      }
    },

    useCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      this.applicationTime = `${hours}:${minutes}`;
    },

    calculateRecommendedInterval() {
      // Simple calculation based on UV index
      if (this.currentUVIndex >= 11) {
        this.recommendedInterval = 1;
      } else if (this.currentUVIndex >= 8) {
        this.recommendedInterval = 1.5;
      } else if (this.currentUVIndex >= 6) {
        this.recommendedInterval = 2;
      } else if (this.currentUVIndex >= 3) {
        this.recommendedInterval = 2.5;
      } else {
        this.recommendedInterval = 3;
      }
    },

    applyRecommendation() {
      this.manualReapplicationInterval = this.recommendedInterval;
    },

    calculateReapplicationTime() {
      // Parse application time
      const [hours, minutes] = this.applicationTime.split(":").map(Number);

      // Create date object for application time
      const applicationDate = new Date();
      applicationDate.setHours(hours, minutes, 0, 0);

      // Calculate reapplication time using manual interval
      const reapplicationDate = new Date(applicationDate);
      const intervalHours = Math.floor(this.manualReapplicationInterval);
      const intervalMinutes = Math.round(
        (this.manualReapplicationInterval - intervalHours) * 60
      );

      reapplicationDate.setHours(
        reapplicationDate.getHours() + intervalHours,
        reapplicationDate.getMinutes() + intervalMinutes
      );

      this.reapplicationTime = reapplicationDate;
    },

    setReminder() {
      if (!this.isFormValid) return;

      this.calculateReapplicationTime();
      this.reminderSet = true;
    },

    setCalendarReminder() {
      if (!this.reapplicationTime) return;

      // Format date for calendar
      const year = this.reapplicationTime.getFullYear();
      const month = (this.reapplicationTime.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const day = this.reapplicationTime.getDate().toString().padStart(2, "0");
      const hours = this.reapplicationTime
        .getHours()
        .toString()
        .padStart(2, "0");
      const minutes = this.reapplicationTime
        .getMinutes()
        .toString()
        .padStart(2, "0");

      const startTime = `${year}${month}${day}T${hours}${minutes}00`;
      const endTime = `${year}${month}${day}T${(parseInt(hours) + 1)
        .toString()
        .padStart(2, "0")}${minutes}00`;

      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reapply+Sunscreen&dates=${startTime}/${endTime}&details=Time+to+reapply+your+sunscreen.`;

      window.open(calendarUrl, "_blank");
    },

    resetForm() {
      this.reminderSet = false;
      this.applicationTime = "";
      this.reapplicationTime = null;
    },

    getUVColor() {
      if (this.currentUVIndex < 3) {
        return "#4abe2a"; // Green for low
      } else if (this.currentUVIndex < 6) {
        return "#d5cc25"; // Yellow for moderate
      } else if (this.currentUVIndex < 10) {
        return "#fa9911"; // Orange for high
      } else {
        return "#f24623"; // Red for extreme
      }
    },

    getUVMessage() {
      if (this.currentUVIndex < 3) {
        return "Low UV Level - Minimal protection needed for most people";
      } else if (this.currentUVIndex < 6) {
        return "Moderate UV Level - Take precautions, wear sunscreen when outdoors";
      } else if (this.currentUVIndex < 10) {
        return "High UV Level - Protection required, reduce time in the sun";
      } else {
        return "Extreme UV Level - Maximum protection required, avoid sun exposure";
      }
    },
  },
};
</script>

<style scoped>
.sunscreen-reminders-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.description {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 30px;
  color: #555;
  line-height: 1.6;
}

.reminder-form {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.uv-section {
  background-color: #f0f8ff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  border: 1px solid #d1e7ff;
}

.uv-prompt {
  text-align: center;
  margin-bottom: 20px;
  color: #0056b3;
  font-weight: 500;
}

.location-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.location-btn {
  margin-top: 10px;
}

.predictions-dropdown {
  position: absolute;
  width: calc(100% - 50px);
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

/* Loading indicator styles */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin: 15px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
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

.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border 0.75s linear infinite;
  margin-right: 5px;
}

@keyframes spinner-border {
  to {
    transform: rotate(360deg);
  }
}

/* Error message styles */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.error-icon {
  font-size: 1.5rem;
  margin-right: 10px;
  font-style: normal;
}

.current-uv {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  border: 1px solid #e9ecef;
  text-align: center;
}

.current-uv h3 {
  margin-bottom: 10px;
}

.recommendation-box {
  background-color: #e8f4f8;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  border-left: 4px solid #007bff;
}

.recommendation-box h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.apply-btn {
  margin-top: 10px;
}

.time-options {
  display: flex;
  align-items: center;
}

.time-input {
  width: 150px;
  margin-left: 10px;
}

.or-text {
  margin: 0 15px;
  color: #6c757d;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0069d9;
}

.btn-secondary {
  background-color: #007bff;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-outline-primary {
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.save-btn {
  width: 100%;
  padding: 12px;
  font-weight: 500;
}

.reminder-summary {
  background-color: #e8f4f8;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.reminder-details {
  margin: 20px 0;
}

.reminder-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.tips-section {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  margin-top: 30px;
}

.tips-list {
  list-style-type: none;
  padding: 0;
}

.tips-list li {
  padding: 8px 0 8px 30px;
  position: relative;
}

.tips-list li:before {
  content: "\2713"; /* Unicode for checkmark */
  color: #28a745;
  position: absolute;
  left: 5px;
}

@media (max-width: 576px) {
  .location-input {
    flex-direction: column;
    gap: 5px;
  }

  .predictions-dropdown {
    width: 100%;
  }

  .time-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .time-input {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
  }

  .or-text {
    margin: 10px 0;
  }

  .reminder-actions {
    flex-direction: column;
  }

  .reminder-actions button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
