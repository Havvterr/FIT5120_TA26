<template>
  <div class="sunscreen-reminders-container">
    <h1>Sunscreen Reminders</h1>
    <p class="description">
      Set up reminders to reapply sunscreen based on your sunscreen type and the
      current UV index. This will help you stay protected throughout the day.
    </p>

    <div class="reminder-form">
      <div class="form-group">
        <label for="sunscreen-type">Select Sunscreen Type:</label>
        <select
          id="sunscreen-type"
          v-model="sunscreenType"
          class="form-control"
        >
          <option value="15">SPF 15</option>
          <option value="30">SPF 30</option>
          <option value="50">SPF 50</option>
          <option value="50+">SPF 50+</option>
        </select>
      </div>

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
        <label for="activity-level">Activity Level:</label>
        <select
          id="activity-level"
          v-model="activityLevel"
          class="form-control"
        >
          <option value="low">Low (Mostly Indoors)</option>
          <option value="moderate">Moderate (Some Outdoor Activity)</option>
          <option value="high">High (Swimming, Sports, Heavy Sweating)</option>
        </select>
      </div>

      <div class="form-group">
        <button
          @click="calculateReminder"
          class="btn btn-success save-btn"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? "Calculating..." : "Save Reminder" }}
        </button>
      </div>
    </div>

    <div v-if="reminderSet" class="reminder-summary">
      <h2>Your Sunscreen Reminder</h2>
      <div class="reminder-details">
        <p><strong>Sunscreen Type:</strong> SPF {{ sunscreenType }}</p>
        <p><strong>Applied At:</strong> {{ formattedApplicationTime }}</p>
        <p><strong>Current UV Index:</strong> {{ currentUVIndex }}</p>
        <p><strong>Reapply At:</strong> {{ formattedReapplicationTime }}</p>
        <p class="reapplication-note">
          Based on your sunscreen type (SPF {{ sunscreenType }}) and the current
          UV index ({{ currentUVIndex }}), you should reapply sunscreen every
          {{ reapplicationInterval }} hours when outdoors.
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
        <li>Use approximately 1 teaspoon for your chest and abdomen.</li>
        <li>Use approximately 1 teaspoon for your back.</li>
        <li>Reapply after swimming, sweating, or toweling off.</li>
        <li>Even water-resistant sunscreen needs to be reapplied regularly.</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SunscreenReminders",
  data() {
    return {
      sunscreenType: "30",
      applicationTime: "",
      activityLevel: "moderate",
      currentUVIndex: 5, // Default UV index
      reapplicationInterval: 2,
      reapplicationTime: null,
      reminderSet: false,
      loading: false,
      // Embedded UV index data for different locations in Australia
      uvData: {
        Sydney: { uvIndex: 6, lat: -33.8688, lon: 151.2093 },
        Melbourne: { uvIndex: 5, lat: -37.8136, lon: 144.9631 },
        Brisbane: { uvIndex: 8, lat: -27.4698, lon: 153.0251 },
        Perth: { uvIndex: 7, lat: -31.9505, lon: 115.8605 },
        Adelaide: { uvIndex: 6, lat: -34.9285, lon: 138.6007 },
        "Gold Coast": { uvIndex: 8, lat: -28.0167, lon: 153.4 },
        Canberra: { uvIndex: 5, lat: -35.2809, lon: 149.13 },
        Hobart: { uvIndex: 4, lat: -42.8821, lon: 147.3272 },
        Darwin: { uvIndex: 10, lat: -12.4634, lon: 130.8456 },
      },
      // SPF reapplication intervals based on UV index and activity level
      spfData: {
        15: {
          baseInterval: 1.5,
          uvAdjustment: {
            low: 1.0, // UV 0-2
            moderate: 0.9, // UV 3-5
            high: 0.8, // UV 6-7
            veryHigh: 0.7, // UV 8-10
            extreme: 0.6, // UV 11+
          },
          activityAdjustment: {
            low: 1.2,
            moderate: 1.0,
            high: 0.7,
          },
        },
        30: {
          baseInterval: 2.0,
          uvAdjustment: {
            low: 1.0,
            moderate: 0.9,
            high: 0.8,
            veryHigh: 0.7,
            extreme: 0.6,
          },
          activityAdjustment: {
            low: 1.2,
            moderate: 1.0,
            high: 0.7,
          },
        },
        50: {
          baseInterval: 2.5,
          uvAdjustment: {
            low: 1.0,
            moderate: 0.9,
            high: 0.8,
            veryHigh: 0.7,
            extreme: 0.6,
          },
          activityAdjustment: {
            low: 1.2,
            moderate: 1.0,
            high: 0.7,
          },
        },
        "50+": {
          baseInterval: 3.0,
          uvAdjustment: {
            low: 1.0,
            moderate: 0.9,
            high: 0.8,
            veryHigh: 0.7,
            extreme: 0.6,
          },
          activityAdjustment: {
            low: 1.2,
            moderate: 1.0,
            high: 0.7,
          },
        },
      },
    };
  },
  computed: {
    isFormValid() {
      return (
        this.sunscreenType &&
        (this.applicationTime || this.applicationTime === "")
      );
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
    useCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      this.applicationTime = `${hours}:${minutes}`;
    },
    async calculateReminder() {
      if (!this.isFormValid) return;

      this.loading = true;

      try {
        // Try to get current location for UV index
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              try {
                const { latitude, longitude } = position.coords;

                // Find the closest city in our embedded data
                let closestCity = "Sydney"; // Default
                let minDistance = Number.MAX_VALUE;

                for (const [city, data] of Object.entries(this.uvData)) {
                  const distance = this.calculateDistance(
                    latitude,
                    longitude,
                    data.lat,
                    data.lon
                  );

                  if (distance < minDistance) {
                    minDistance = distance;
                    closestCity = city;
                  }
                }

                // Use the UV index from the closest city
                this.currentUVIndex = this.uvData[closestCity].uvIndex;

                // Calculate reapplication interval based on SPF, UV index, and activity level
                this.calculateReapplicationInterval();

                // Calculate reapplication time
                this.calculateReapplicationTime();

                this.reminderSet = true;
                this.loading = false;
              } catch (error) {
                console.error("Error determining location:", error);
                // Use default UV index
                this.calculateReapplicationInterval();
                this.calculateReapplicationTime();
                this.reminderSet = true;
                this.loading = false;
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Use default UV index
              this.calculateReapplicationInterval();
              this.calculateReapplicationTime();
              this.reminderSet = true;
              this.loading = false;
            }
          );
        } else {
          // Browser doesn't support geolocation, use default UV index
          this.calculateReapplicationInterval();
          this.calculateReapplicationTime();
          this.reminderSet = true;
          this.loading = false;
        }
      } catch (error) {
        console.error("Error setting reminder:", error);
        this.loading = false;
        alert("An error occurred. Please try again.");
      }
    },
    calculateDistance(lat1, lon1, lat2, lon2) {
      // Simple Euclidean distance calculation (sufficient for our purposes)
      const latDiff = lat1 - lat2;
      const lonDiff = lon1 - lon2;
      return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
    },
    calculateReapplicationInterval() {
      // Get SPF data
      const spfInfo = this.spfData[this.sunscreenType];
      let baseInterval = spfInfo.baseInterval;

      // Determine UV level
      let uvLevel = "low";
      if (this.currentUVIndex >= 11) {
        uvLevel = "extreme";
      } else if (this.currentUVIndex >= 8) {
        uvLevel = "veryHigh";
      } else if (this.currentUVIndex >= 6) {
        uvLevel = "high";
      } else if (this.currentUVIndex >= 3) {
        uvLevel = "moderate";
      }

      // Apply UV adjustment
      baseInterval *= spfInfo.uvAdjustment[uvLevel];

      // Apply activity adjustment
      baseInterval *= spfInfo.activityAdjustment[this.activityLevel];

      // Round to nearest 0.5 hour
      this.reapplicationInterval = Math.round(baseInterval * 2) / 2;
    },
    calculateReapplicationTime() {
      // Parse application time
      const [hours, minutes] = this.applicationTime.split(":").map(Number);

      // Create date object for application time
      const applicationDate = new Date();
      applicationDate.setHours(hours, minutes, 0, 0);

      // Calculate reapplication time
      const reapplicationDate = new Date(applicationDate);
      const intervalHours = Math.floor(this.reapplicationInterval);
      const intervalMinutes = Math.round(
        (this.reapplicationInterval - intervalHours) * 60
      );

      reapplicationDate.setHours(
        reapplicationDate.getHours() + intervalHours,
        reapplicationDate.getMinutes() + intervalMinutes
      );

      this.reapplicationTime = reapplicationDate;
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

      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=Reapply+Sunscreen&dates=${startTime}/${endTime}&details=Time+to+reapply+your+SPF+${this.sunscreenType}+sunscreen.`;

      window.open(calendarUrl, "_blank");
    },
    resetForm() {
      this.reminderSet = false;
      this.applicationTime = "";
      this.reapplicationTime = null;
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
  background-color: #6c757d;
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

.reapplication-note {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 15px;
  margin-top: 20px;
  border-radius: 4px;
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
