<template>
  <div class="personalized-advice-container">
    <h1>Personalized Sun Safety Advice</h1>

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
      <p>Loading your personalized advice...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="advice && !loading" class="advice-container">
      <h2>Your Personalized Sun Safety Plan</h2>

      <div class="risk-assessment">
        <h3>Risk Assessment</h3>
        <p>{{ advice.riskAssessment }}</p>
      </div>

      <div class="exposure-guidelines">
        <h3>Safe Sun Exposure Guidelines</h3>
        <p>{{ advice.exposureGuidelines }}</p>
      </div>

      <div class="vitamin-d-info">
        <h3>Vitamin D Recommendations</h3>
        <p>{{ advice.vitaminDInfo }}</p>
      </div>

      <div class="sunscreen-recommendation">
        <h3>Sunscreen Application</h3>
        <p>
          Based on your skin type and current UV index ({{ currentUVIndex }}),
          you should apply:
        </p>
        <div class="sunscreen-amount">
          <span class="amount">{{ advice.sunscreenAmount }}</span> teaspoons of
          sunscreen
        </div>
        <p class="reapplication">
          Reapply every {{ advice.reapplicationTime }} hours when outdoors.
        </p>
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
      selectedSkinType: 3, // Default to middle skin type
      currentUVIndex: 5, // Default UV index
      advice: null,
      loading: false,
      error: null,
      skinTypeDescriptions: [
        "Very fair skin, blue/green eyes, blond/red hair. Always burns, never tans.",
        "Fair skin, blue eyes. Burns easily, tans minimally.",
        "Light brown skin. Burns moderately, tans gradually.",
        "Moderate brown skin. Burns minimally, tans well.",
        "Dark brown skin. Rarely burns, tans profusely.",
        "Darkest brown skin. Never burns, deeply pigmented.",
      ],
      // Embed data directly in the frontend
      skinAdviceData: {
        1: {
          // Very fair skin
          riskAssessment: {
            low: "With your very fair skin (Type I) and the current low UV index, your risk of sunburn is relatively low, but basic protection is still recommended.",
            moderate:
              "With your very fair skin (Type I) and the current moderate UV index, you should use sun protection during peak hours.",
            high: "With your very fair skin (Type I) and the current high UV index, you are at high risk of sunburn. Use strong sun protection.",
            veryHigh:
              "With your very fair skin (Type I) and the current very high UV index, you are at very high risk of sunburn. Seek shade and use maximum protection.",
            extreme:
              "With your very fair skin (Type I) and the current extreme UV index, you are at extreme risk of sunburn. Avoid sun exposure if possible.",
          },
          vitaminDInfo:
            "With your fair skin tone, you need minimal sun exposure for vitamin D production. Just 5-10 minutes of midday sun exposure 2-3 times per week should be sufficient. Always use sun protection after this period.",
          sunscreenAmount: 2.5,
          reapplicationTime: {
            low: 2,
            moderate: 1.5,
            high: 1,
            veryHigh: 1,
            extreme: 1,
          },
          safeExposureMinutes: {
            low: 15,
            moderate: 10,
            high: 5,
            veryHigh: 5,
            extreme: 0,
          },
        },
        2: {
          // Fair skin
          riskAssessment: {
            low: "With your fair skin (Type II) and the current low UV index, your risk of sunburn is relatively low, but basic protection is still recommended.",
            moderate:
              "With your fair skin (Type II) and the current moderate UV index, you should use sun protection during peak hours.",
            high: "With your fair skin (Type II) and the current high UV index, you are at high risk of sunburn. Use strong sun protection.",
            veryHigh:
              "With your fair skin (Type II) and the current very high UV index, you are at very high risk of sunburn. Seek shade and use maximum protection.",
            extreme:
              "With your fair skin (Type II) and the current extreme UV index, you are at extreme risk of sunburn. Avoid sun exposure if possible.",
          },
          vitaminDInfo:
            "With your fair skin tone, you need minimal sun exposure for vitamin D production. Just 5-10 minutes of midday sun exposure 2-3 times per week should be sufficient. Always use sun protection after this period.",
          sunscreenAmount: 2.5,
          reapplicationTime: {
            low: 2,
            moderate: 2,
            high: 1.5,
            veryHigh: 1.5,
            extreme: 1,
          },
          safeExposureMinutes: {
            low: 20,
            moderate: 15,
            high: 10,
            veryHigh: 5,
            extreme: 0,
          },
        },
        3: {
          // Light brown skin
          riskAssessment: {
            low: "With your light brown skin (Type III) and the current low UV index, your risk of sunburn is relatively low, but basic protection is still recommended.",
            moderate:
              "With your light brown skin (Type III) and the current moderate UV index, you should use sun protection during peak hours.",
            high: "With your light brown skin (Type III) and the current high UV index, you are at risk of sunburn. Use sun protection.",
            veryHigh:
              "With your light brown skin (Type III) and the current very high UV index, you are at high risk of sunburn. Use strong sun protection.",
            extreme:
              "With your light brown skin (Type III) and the current extreme UV index, you are at very high risk of sunburn. Seek shade and use maximum protection.",
          },
          vitaminDInfo:
            "With your medium skin tone, aim for 10-20 minutes of sun exposure 2-3 times per week for vitamin D production. Use sun protection after this period.",
          sunscreenAmount: 2,
          reapplicationTime: {
            low: 2.5,
            moderate: 2,
            high: 2,
            veryHigh: 1.5,
            extreme: 1.5,
          },
          safeExposureMinutes: {
            low: 30,
            moderate: 20,
            high: 15,
            veryHigh: 10,
            extreme: 5,
          },
        },
        4: {
          // Moderate brown skin
          riskAssessment: {
            low: "With your moderate brown skin (Type IV) and the current low UV index, your risk of sunburn is low, but basic protection is still beneficial.",
            moderate:
              "With your moderate brown skin (Type IV) and the current moderate UV index, you should consider using sun protection during peak hours.",
            high: "With your moderate brown skin (Type IV) and the current high UV index, you should use sun protection.",
            veryHigh:
              "With your moderate brown skin (Type IV) and the current very high UV index, you are at risk of sunburn. Use sun protection.",
            extreme:
              "With your moderate brown skin (Type IV) and the current extreme UV index, you are at high risk of sunburn. Use strong sun protection.",
          },
          vitaminDInfo:
            "With your medium skin tone, aim for 10-20 minutes of sun exposure 2-3 times per week for vitamin D production. Use sun protection after this period.",
          sunscreenAmount: 2,
          reapplicationTime: {
            low: 3,
            moderate: 2.5,
            high: 2,
            veryHigh: 2,
            extreme: 1.5,
          },
          safeExposureMinutes: {
            low: 40,
            moderate: 30,
            high: 20,
            veryHigh: 15,
            extreme: 10,
          },
        },
        5: {
          // Dark brown skin
          riskAssessment: {
            low: "With your dark brown skin (Type V) and the current low UV index, your risk of sunburn is very low, but sun protection is still beneficial for long exposures.",
            moderate:
              "With your dark brown skin (Type V) and the current moderate UV index, consider using sun protection for extended outdoor activities.",
            high: "With your dark brown skin (Type V) and the current high UV index, you should use sun protection for extended outdoor activities.",
            veryHigh:
              "With your dark brown skin (Type V) and the current very high UV index, you should use sun protection.",
            extreme:
              "With your dark brown skin (Type V) and the current extreme UV index, you are at risk of sunburn. Use sun protection.",
          },
          vitaminDInfo:
            "With your darker skin tone, you may need more sun exposure to produce adequate vitamin D. Consider 15-30 minutes of sun exposure 2-3 times per week, and discuss vitamin D supplements with your healthcare provider.",
          sunscreenAmount: 1.5,
          reapplicationTime: {
            low: 3,
            moderate: 3,
            high: 2.5,
            veryHigh: 2,
            extreme: 2,
          },
          safeExposureMinutes: {
            low: 60,
            moderate: 45,
            high: 30,
            veryHigh: 20,
            extreme: 15,
          },
        },
        6: {
          // Darkest brown skin
          riskAssessment: {
            low: "With your darkest brown skin (Type VI) and the current low UV index, your risk of sunburn is extremely low, but sun protection is still beneficial for very long exposures.",
            moderate:
              "With your darkest brown skin (Type VI) and the current moderate UV index, consider using sun protection for extended outdoor activities.",
            high: "With your darkest brown skin (Type VI) and the current high UV index, consider using sun protection for extended outdoor activities.",
            veryHigh:
              "With your darkest brown skin (Type VI) and the current very high UV index, you should use sun protection for extended outdoor activities.",
            extreme:
              "With your darkest brown skin (Type VI) and the current extreme UV index, you should use sun protection.",
          },
          vitaminDInfo:
            "With your darker skin tone, you may need more sun exposure to produce adequate vitamin D. Consider 15-30 minutes of sun exposure 2-3 times per week, and discuss vitamin D supplements with your healthcare provider.",
          sunscreenAmount: 1.5,
          reapplicationTime: {
            low: 3,
            moderate: 3,
            high: 3,
            veryHigh: 2.5,
            extreme: 2,
          },
          safeExposureMinutes: {
            low: 90,
            moderate: 60,
            high: 45,
            veryHigh: 30,
            extreme: 20,
          },
        },
      },
    };
  },
  methods: {
    async getSkinAdvice() {
      this.loading = true;
      this.error = null;

      try {
        // Get current UV index (still using API as this is real-time data)
        try {
          // Try to get UV index for current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const response = await axios.get(
                    `/api/uv-index?lat=${latitude}&lon=${longitude}`
                  );
                  this.currentUVIndex = response.data.uvIndex;
                  this.generateAdvice();
                } catch (error) {
                  console.error("Error fetching UV index:", error);
                  // Use default UV index
                  this.generateAdvice();
                }
              },
              (error) => {
                console.error("Geolocation error:", error);
                // Use default UV index
                this.generateAdvice();
              }
            );
          } else {
            // Browser doesn't support geolocation
            this.generateAdvice();
          }
        } catch (error) {
          // Use default UV index on error
          this.generateAdvice();
        }
      } catch (err) {
        this.error =
          "Failed to load personalized advice. Please try again later.";
        console.error("Error generating skin advice:", err);
        this.loading = false;
      }
    },

    generateAdvice() {
      // Determine risk level based on UV index
      let riskLevel = "low";
      if (this.currentUVIndex >= 11) {
        riskLevel = "extreme";
      } else if (this.currentUVIndex >= 8) {
        riskLevel = "veryHigh";
      } else if (this.currentUVIndex >= 6) {
        riskLevel = "high";
      } else if (this.currentUVIndex >= 3) {
        riskLevel = "moderate";
      }

      // Get advice data for current skin type
      const skinData = this.skinAdviceData[this.selectedSkinType];

      // Generate personalized advice
      this.advice = {
        riskAssessment: skinData.riskAssessment[riskLevel],
        exposureGuidelines: `Based on your skin type and the current UV index (${this.currentUVIndex}), you should limit direct sun exposure to ${skinData.safeExposureMinutes[riskLevel]} minutes without protection.`,
        vitaminDInfo: skinData.vitaminDInfo,
        sunscreenAmount: `${skinData.sunscreenAmount} teaspoons`,
        reapplicationTime: skinData.reapplicationTime[riskLevel],
      };

      this.loading = false;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1,
h2,
h3 {
  color: #2c3e50;
}

.skin-type-selector {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.instruction {
  color: #6c757d;
  margin-bottom: 15px;
}

.slider-container {
  margin: 20px 0;
}

.skin-type-slider {
  width: 100%;
  height: 10px;
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
  border-radius: 5px;
}

.skin-type-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2b8fbe;
  cursor: pointer;
}

.skin-type-labels {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.skin-type-colors {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.skin-color {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid transparent;
}

.skin-color.selected {
  border-color: #137dbf;
  transform: scale(1.2);
}

.type-1 {
  background-color: #ffe0bd;
}
.type-2 {
  background-color: #f1c27d;
}
.type-3 {
  background-color: #e0ac69;
}
.type-4 {
  background-color: #c68642;
}
.type-5 {
  background-color: #8d5524;
}
.type-6 {
  background-color: #5d4037;
}

.skin-type-description {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9ecef;
  border-radius: 5px;
}

.advice-container {
  background-color: #e8f4f8;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.risk-assessment,
.exposure-guidelines,
.vitamin-d-info,
.sunscreen-recommendation {
  margin-bottom: 20px;
}

.sunscreen-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin: 15px 0;
}

.reapplication {
  font-style: italic;
  color: #6c757d;
}

.loading-indicator {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>
