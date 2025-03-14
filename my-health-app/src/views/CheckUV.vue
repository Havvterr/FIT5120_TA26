<!-- src/components/CheckUV.vue -->
<template>
  <div class="check-uv">
    <div class="content-container">
      <div class="white-box">
        <h1 class="display-4">UV Level Checker</h1>

        <!-- Input Section -->
        <div class="input-area">
          <label for="pincode-input">Enter your pincode:</label>
          <input
            id="pincode-input"
            type="text"
            v-model="pincode"
            placeholder="e.g. 3000"
            maxlength="4"
          />
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
    checkUVIndex() {
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
      // Simulate a random UV index from 0 to 11
      this.uvIndex = Math.floor(Math.random() * 12);
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
  width: 120px;
  text-align: center;
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
