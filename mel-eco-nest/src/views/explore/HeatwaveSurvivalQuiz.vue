<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>Heatwave Survival Quiz</h1>
      <p>Test your knowledge about heatwave safety through real-life scenarios</p>
    </div>

    <div class="scenario-container" v-if="!quizCompleted">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        <span class="progress-text">Scenario {{ currentScenario + 1 }} of 3</span>
      </div>

      <div class="scenario-content">
        <div class="scenario-header">
          <h2>{{ scenarios[currentScenario].title }}</h2>
          <p class="scenario-background">{{ scenarios[currentScenario].background }}</p>
        </div>

        <div class="options-container">
          <button
            v-for="(option, index) in scenarios[currentScenario].options"
            :key="index"
            :class="['option-button', {
              'correct': showFeedback && option.isCorrect,
              'incorrect': showFeedback && !option.isCorrect && selectedOption === index,
              'warning': showFeedback && option.isWarning && selectedOption === index
            }]"
            @click="selectOption(index)"
            :disabled="showFeedback"
          >
            {{ option.text }}
          </button>
        </div>

        <div v-if="showFeedback" class="feedback-container">
          <div class="feedback-content">
            <div class="feedback-icon">
              <i :class="feedbackIcon"></i>
            </div>
            <p>{{ scenarios[currentScenario].options[selectedOption].feedback }}</p>
          </div>
          <button class="next-button" @click="nextScenario">
            {{ currentScenario === scenarios.length - 1 ? 'Complete Quiz' : 'Next Scenario' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="completion-container">
      <h2>Quiz Completed!</h2>
      <p>You've completed all scenarios. Your score: {{ score }}/3</p>
      <div class="completion-actions">
        <router-link to="/explore/heat-guide" class="return-button">
          Return to Guide
        </router-link>
        <button @click="restartQuiz" class="restart-button">
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scenarios = [
  {
    title: "Scenario 1: Elderly Home Care",
    background: "You are a 78-year-old person living alone. It's 1 PM, and the temperature has reached 41°C. You feel slightly dry in the mouth but not thirsty yet. The house feels stuffy, and you're thinking about what to do.",
    options: [
      {
        text: "Turn on the AC but keep wearing long sleeves and use a blanket for your nap",
        isCorrect: false,
        isWarning: false,
        feedback: "❌ While using AC is good, wearing thick clothes and using blankets will still raise your body temperature, potentially leading to heatstroke."
      },
      {
        text: "Drink a large glass of ice water and take a cold shower",
        isCorrect: false,
        isWarning: true,
        feedback: "⚠️ Cold showers and ice water can cause sudden body temperature drops, which may lead to dangerous blood pressure fluctuations, especially for elderly people."
      },
      {
        text: "Use a damp towel, turn on the fan, check room temperature and drink lukewarm water",
        isCorrect: true,
        isWarning: false,
        feedback: "✅ This is the best approach. Damp towels and fans help cool the body, monitoring temperature prevents overheating, and lukewarm water is safer for hydration."
      }
    ]
  },
  {
    title: "Scenario 2: Outdoor Worker Decision",
    background: "You are a 35-year-old construction worker who needs to install equipment outdoors at 2 PM. The weather is hot with no clouds and intense sunlight.",
    options: [
      {
        text: "Wear dark-colored long pants and sleeves to prevent sunburn, stick to the schedule",
        isCorrect: false,
        isWarning: true,
        feedback: "⚠️ While sun protection is important, dark clothes absorb heat and aren't breathable, increasing risk."
      },
      {
        text: "Reduce work hours, hydrate hourly, wear light-colored breathable clothing",
        isCorrect: true,
        isWarning: false,
        feedback: "✅ This is the best heat prevention method. Properly scheduling work and rest periods while staying hydrated is key to preventing heatstroke."
      },
      {
        text: "Skip water to reduce sweating and finish work earlier",
        isCorrect: false,
        isWarning: false,
        feedback: "❌ Serious mistake! Not drinking water leads to rapid dehydration, causing heat exhaustion or even heatstroke."
      }
    ]
  },
  {
    title: "Scenario 3: Children's Afternoon Activity Planning",
    background: "You are a parent of a 12-year-old child who wants to play soccer in the park on a weekend afternoon. The temperature is 39°C with intense sunlight.",
    options: [
      {
        text: "Allow them to go out as long as they bring a water bottle",
        isCorrect: false,
        isWarning: false,
        feedback: "❌ Wrong! Even with water, exercising in high temperatures can quickly lead to heatstroke."
      },
      {
        text: "Refuse and suggest going out in the early morning or evening instead",
        isCorrect: true,
        isWarning: false,
        feedback: "✅ Correct! Activities in early morning or evening effectively avoid peak heat hours and reduce risks."
      },
      {
        text: "Allow but require rest every 30 minutes and provide cold drinks to cool down",
        isCorrect: false,
        isWarning: true,
        feedback: "⚠️ Partially correct, but cold drinks might affect digestion, and exposure to sunlight during peak heat still poses high risks."
      }
    ]
  }
]

const currentScenario = ref(0)
const selectedOption = ref(null)
const showFeedback = ref(false)
const quizCompleted = ref(false)
const score = ref(0)

const progressPercentage = computed(() => {
  return ((currentScenario.value + 1) / scenarios.length) * 100
})

const feedbackIcon = computed(() => {
  const option = scenarios[currentScenario.value].options[selectedOption.value]
  if (option.isCorrect) return 'fas fa-check-circle'
  if (option.isWarning) return 'fas fa-exclamation-triangle'
  return 'fas fa-times-circle'
})

const selectOption = (index) => {
  selectedOption.value = index
  showFeedback.value = true
  if (scenarios[currentScenario.value].options[index].isCorrect) {
    score.value++
  }
}

const nextScenario = () => {
  if (currentScenario.value < scenarios.length - 1) {
    currentScenario.value++
    selectedOption.value = null
    showFeedback.value = false
  } else {
    quizCompleted.value = true
  }
}

const restartQuiz = () => {
  currentScenario.value = 0
  selectedOption.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.quiz-header {
  text-align: center;
  margin-bottom: 40px;
}

.quiz-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.quiz-header p {
  font-size: 1.2rem;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-bottom: 30px;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #0d6efd;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 0.9rem;
  color: #666;
}

.scenario-content {
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.scenario-header {
  margin-bottom: 30px;
}

.scenario-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.scenario-background {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.option-button {
  padding: 20px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  background-color: white;
  font-size: 1.1rem;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.option-button.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.option-button.incorrect {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.option-button.warning {
  background-color: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.feedback-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.feedback-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.feedback-icon {
  font-size: 1.5rem;
}

.feedback-icon .fa-check-circle {
  color: #28a745;
}

.feedback-icon .fa-times-circle {
  color: #dc3545;
}

.feedback-icon .fa-exclamation-triangle {
  color: #ffc107;
}

.next-button {
  width: 100%;
  padding: 15px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.next-button:hover {
  background-color: #0b5ed7;
}

.completion-container {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.completion-container h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.completion-container p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.completion-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.return-button,
.restart-button {
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.return-button {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
}

.return-button:hover {
  background-color: #5a6268;
}

.restart-button {
  background-color: #0d6efd;
  color: white;
  border: none;
}

.restart-button:hover {
  background-color: #0b5ed7;
}

@media (max-width: 576px) {
  .quiz-container {
    padding: 20px;
  }

  .quiz-header h1 {
    font-size: 2rem;
  }

  .scenario-header h2 {
    font-size: 1.5rem;
  }

  .option-button {
    padding: 15px;
  }

  .completion-actions {
    flex-direction: column;
  }
}
</style>
