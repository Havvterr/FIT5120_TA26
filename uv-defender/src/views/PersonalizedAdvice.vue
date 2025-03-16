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
      currentUVIndex: 0,
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
    };
  },
  methods: {
    async getSkinAdvice() {
      this.loading = true;
      this.error = null;

      try {
        // First get current UV index (could be from another API or service)
        const uvResponse = await axios.get("/api/uv-index");
        this.currentUVIndex = uvResponse.data.uvIndex;

        // Then get personalized advice based on skin type and UV index
        const response = await axios.get(
          `/api/skin-advice/${this.selectedSkinType}?uvIndex=${this.currentUVIndex}`
        );
        this.advice = response.data;
      } catch (err) {
        this.error =
          "Failed to load personalized advice. Please try again later.";
        console.error("Error fetching skin advice:", err);
      } finally {
        this.loading = false;
      }
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
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.sunscreen-amount {
  font-size: 24px;
  margin: 15px 0;
  text-align: center;
}

.amount {
  font-weight: bold;
  color: #28a745;
  font-size: 32px;
}

.reapplication {
  font-style: italic;
  color: #dc3545;
}

.loading-indicator,
.error-message {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
}

.loading-indicator {
  background-color: #e9ecef;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
