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
          @change="getSkinAdvice"
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
        </div>
      </div>

      <div class="advice-card sunscreen-recommendation">
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
import axios from "axios";

export default {
  name: "PersonalizedAdvice",
  data() {
    return {
      selectedSkinType: 3, // Default to medium skin tone
      currentUVIndex: 5, // Default UV index
      advice: null,
      loading: false,
      error: null,
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
  methods: {
    async getSkinAdvice() {
      this.loading = true;
      this.error = null;

      try {
        // Get current location's UV index
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const response = await axios.get(
                  `/api/uv-index?lat=${latitude}&lon=${longitude}`
                );
                this.currentUVIndex = response.data.uvIndex;
                this.fetchAdviceFromDatabase();
              } catch (error) {
                console.error("Error fetching UV index:", error);
                // Use default UV index
                this.fetchAdviceFromDatabase();
              }
            },
            (error) => {
              console.error("Geolocation error:", error);
              // Use default UV index
              this.fetchAdviceFromDatabase();
            }
          );
        } else {
          // Browser doesn't support geolocation
          this.fetchAdviceFromDatabase();
        }
      } catch (err) {
        this.error =
          "Failed to load personalized advice. Please try again later.";
        console.error("Error generating skin advice:", err);
        this.loading = false;
      }
    },

    async fetchAdviceFromDatabase() {
      try {
        // Fetch advice data from database
        const response = await axios.get(
          `/api/personalized-advice?skinType=${this.selectedSkinType}&uvIndex=${this.currentUVIndex}`
        );

        this.advice = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching advice from database:", error);
        this.error =
          "Unable to retrieve advice from database. Please try again later.";
        this.loading = false;
      }
    },

    calculateSunscreenAmount() {
      // Calculate recommended sunscreen amount based on UV index and skin type
      let amount = 2; // Default amount

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
    // Get advice when component is mounted
    this.getSkinAdvice();
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
}
</style>
