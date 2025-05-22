<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>Heatwave Survival Quiz</h1>
      <p>Test your knowledge about heatwave safety through real-life scenarios</p>
    </div>

    <div v-if="selectedScenario === null" class="scenario-selection">
      <h2>Choose a Scenario</h2>
      <div class="scenario-buttons">
        <button
          v-for="(scenario, index) in scenarioList"
          :key="index"
          @click="selectScenario(index)"
          class="scenario-button"
        >
          {{ scenario.title }}
        </button>
      </div>
    </div>

    <div class="scenario-container" v-else-if="!quizCompleted">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        <span class="progress-text"
          >Question {{ currentScenario + 1 }} / {{ currentScenarioList.length }}</span
        >
      </div>

      <div class="scenario-content">
        <div class="scenario-header">
          <h2>{{ currentQuestion.title }}</h2>
          <p class="scenario-background">{{ currentQuestion.background }}</p>
        </div>

        <div class="options-container">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :class="[
              'option-button',
              {
                correct: showFeedback && option.isCorrect,
                incorrect: showFeedback && !option.isCorrect && selectedOption === index,
                warning: showFeedback && option.isWarning && selectedOption === index,
              },
            ]"
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
            <p>{{ currentQuestion.options[selectedOption].feedback }}</p>
          </div>
          <button class="next-button" @click="nextScenario">
            {{ currentScenario === currentScenarioList.length - 1 ? 'Complete' : 'Next' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="completion-container">
      <h2>Quiz Completed!</h2>
      <p>You have completed all questions. Score: {{ score }}/{{ currentScenarioList.length }}</p>
      <div class="completion-actions">
        <router-link to="/explore/heat-guide" class="return-button"> Return to Guide </router-link>
        <button @click="restartQuiz" class="restart-button">Try Again</button>
        <button @click="returnToQuiz" class="return-quiz-button">Return to Scenarios</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scenarioList = [
  {
    title: '🌞 Heatwave Survival Guide for Elderly',
    scenarios: [
      {
        title: 'Dealing with Indoor Heat at Noon',
        background:
          "It's noon in summer, you are a 76-year-old living alone, and the indoor environment feels stuffy.",
        options: [
          {
            text: 'Open all windows for ventilation',
            isCorrect: false,
            isWarning: false,
            feedback:
              'Opening windows at noon lets hot air in, which will increase indoor temperature.',
          },
          {
            text: 'Close windows, draw curtains, turn on fan',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! This effectively blocks radiant heat and promotes air circulation.',
          },
          {
            text: 'Set air conditioner to 16°C',
            isCorrect: false,
            isWarning: true,
            feedback:
              'Setting temperature too low may cause discomfort, recommended to maintain 24-26°C.',
          },
        ],
      },
      {
        title: 'Timing of Water Intake',
        background: "At 11 AM, you're sweating but don't feel thirsty.",
        options: [
          {
            text: 'Wait until thirsty to drink water',
            isCorrect: false,
            isWarning: false,
            feedback:
              'Elderly may have reduced thirst perception, waiting until thirsty is too late.',
          },
          {
            text: 'Proactively drink water',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Regular hydration is safer than waiting until thirsty.',
          },
          {
            text: 'Eat salty food instead of drinking water',
            isCorrect: false,
            isWarning: true,
            feedback:
              "Salty foods increase body's water needs and cannot replace direct water intake.",
          },
        ],
      },
      {
        title: 'Indoor Temperature Monitoring',
        background: "Before going out, you want to check if your home's temperature is safe.",
        options: [
          {
            text: 'Feel temperature by touching walls or floor',
            isCorrect: false,
            isWarning: false,
            feedback: 'Subjective feeling is not accurate enough to judge indoor temperature.',
          },
          {
            text: 'Use a thermometer and hygrometer',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Professional equipment accurately monitors indoor temperature and humidity.',
          },
          {
            text: 'Judge by observing outdoor sunlight and sky',
            isCorrect: false,
            isWarning: true,
            feedback: 'Outdoor weather conditions cannot accurately reflect indoor temperature.',
          },
        ],
      },
      {
        title: 'Heat Stress Symptom Recognition',
        background: 'On a hot afternoon, you feel dizzy and your skin is dry and hot.',
        options: [
          {
            text: 'Might be a cold',
            isCorrect: false,
            isWarning: false,
            feedback: 'These symptoms are more likely early signs of heat stress.',
          },
          {
            text: 'These are warning signs of heat stress',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Dizziness and hot, dry skin are early symptoms of heat stress, requiring immediate cooling measures.',
          },
          {
            text: 'Just indigestion, observe for a while',
            isCorrect: false,
            isWarning: true,
            feedback: 'These symptoms are unrelated to digestion and need immediate attention.',
          },
        ],
      },
      {
        title: 'Emergency Situation Management',
        background: "You're alone at home and start feeling confused.",
        options: [
          {
            text: 'Lie down with a wet towel',
            isCorrect: false,
            isWarning: false,
            feedback: 'Confusion is a serious symptom requiring immediate medical attention.',
          },
          {
            text: 'Call emergency services and start cooling down',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Confusion is a severe heat stress symptom requiring immediate medical attention.',
          },
          {
            text: 'Drink ice water and wait for improvement',
            isCorrect: false,
            isWarning: true,
            feedback:
              'Ice water may irritate the stomach, and self-treatment is not advisable when confused.',
          },
        ],
      },
    ],
  },
  {
    title: '👨‍👩‍👧 Family Child Heatwave Protection',
    scenarios: [
      {
        title: "Children's Outdoor Activity Planning",
        background:
          'You are taking care of a 9-year-old child during a heatwave. The child wants to play soccer outside.',
        options: [
          {
            text: 'Give them a bottle of water and let them go',
            isCorrect: false,
            isWarning: false,
            feedback: 'Even with water, exercising in high temperatures can lead to heat stroke.',
          },
          {
            text: 'Suggest waiting until evening',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Evening temperatures are lower and more suitable for outdoor activities.',
          },
          {
            text: 'Allow them to go but return in 30 minutes',
            isCorrect: false,
            isWarning: true,
            feedback:
              '30 minutes in high heat still poses risks, better to choose a cooler time period.',
          },
        ],
      },
      {
        title: 'Indoor Temperature Management',
        background: 'Indoor temperature has reached 32°C, action needs to be taken.',
        options: [
          {
            text: 'Open windows for ventilation',
            isCorrect: false,
            isWarning: false,
            feedback: 'When outdoor temperature is higher, opening windows lets hot air in.',
          },
          {
            text: 'Close windows and draw curtains',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! This blocks hot air and direct sunlight.',
          },
          {
            text: 'Rely only on natural breeze',
            isCorrect: false,
            isWarning: true,
            feedback:
              'During heatwaves, natural breeze can be hot too, more active cooling measures are needed.',
          },
        ],
      },
      {
        title: "Child's Sleep Environment",
        background:
          'In an apartment without air conditioning, the child is napping with a thick blanket.',
        options: [
          {
            text: 'Switch to a thin sheet',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Using breathable thin sheets is more suitable for hot weather.',
          },
          {
            text: 'Maintain current situation',
            isCorrect: false,
            isWarning: false,
            feedback: 'Thick blankets increase body temperature and hinder heat dissipation.',
          },
          {
            text: 'Point fan directly at the child',
            isCorrect: false,
            isWarning: true,
            feedback: 'Directing fan at the child may cause discomfort or catching cold.',
          },
        ],
      },
      {
        title: 'Child Heat Stress Symptoms',
        background: 'The child shows symptoms of headache, dry mouth, and irritability.',
        options: [
          {
            text: 'Give water, rest, and cool down',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! These are early symptoms of dehydration and heat stress, requiring immediate attention.',
          },
          {
            text: 'Give juice and observe',
            isCorrect: false,
            isWarning: false,
            feedback: 'Juice has high sugar content and is not good for hydration.',
          },
          {
            text: 'Give cold medicine',
            isCorrect: false,
            isWarning: true,
            feedback: 'These symptoms are not related to cold, they are signs of heat stress.',
          },
        ],
      },
      {
        title: 'Outdoor Activity Time Selection',
        background: 'You are planning an outdoor activity.',
        options: [
          {
            text: 'Around 12 noon',
            isCorrect: false,
            isWarning: false,
            feedback: 'Noon is the hottest time of day, unsuitable for outdoor activities.',
          },
          {
            text: '4 PM',
            isCorrect: false,
            isWarning: false,
            feedback: 'Temperature is still high at 4 PM.',
          },
          {
            text: 'Between 7-9 AM',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Morning has the lowest temperature and UV intensity.',
          },
        ],
      },
    ],
  },
  {
    title: '👷 Outdoor Worker Heat Protection',
    scenarios: [
      {
        title: 'Water Intake Management',
        background: 'You are a road construction worker who needs to work in high temperatures.',
        options: [
          {
            text: 'Only drink water when thirsty',
            isCorrect: false,
            isWarning: false,
            feedback: 'Waiting until thirsty is too late, you should regularly hydrate.',
          },
          {
            text: 'Drink water every hour',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Regular hydration is key to preventing heat stress.',
          },
          {
            text: 'Replace water with energy drinks',
            isCorrect: false,
            isWarning: true,
            feedback:
              'Energy drinks may affect water absorption, plain water should be the main choice.',
          },
        ],
      },
      {
        title: 'Work Attire Selection',
        background: 'You plan to work wearing light-colored long sleeves, a hat, and sunglasses.',
        options: [
          {
            text: 'This attire is appropriate',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! This outfit provides sun protection while maintaining ventilation.',
          },
          {
            text: 'Too hot, should remove shirt',
            isCorrect: false,
            isWarning: false,
            feedback: 'Exposed skin increases risk of sunburn and heat stress.',
          },
          {
            text: 'Sunglasses are unnecessary',
            isCorrect: false,
            isWarning: true,
            feedback: 'Sunglasses protect your eyes and are essential safety equipment.',
          },
        ],
      },
      {
        title: 'Rest Area Selection',
        background: 'You decide to rest in a parked truck.',
        options: [
          {
            text: 'This is safe',
            isCorrect: false,
            isWarning: false,
            feedback: 'Enclosed vehicle temperatures can exceed 50°C, extremely dangerous.',
          },
          {
            text: 'Unsafe, vehicle temperature can be lethal',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Choose a shaded, ventilated area for rest.',
          },
          {
            text: 'Safe if windows are open',
            isCorrect: false,
            isWarning: true,
            feedback: 'Even with open windows, vehicle temperature can still be dangerously high.',
          },
        ],
      },
      {
        title: 'Heat Stress Symptom Management',
        background: 'You start feeling dizzy and nauseous.',
        options: [
          {
            text: 'Continue working',
            isCorrect: false,
            isWarning: false,
            feedback: 'Continuing work may worsen symptoms, leading to serious consequences.',
          },
          {
            text: 'Rest immediately, cool down and hydrate',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! These are early heat stress symptoms requiring immediate attention.',
          },
          {
            text: 'Eat something to feel better',
            isCorrect: false,
            isWarning: true,
            feedback: "These symptoms aren't related to hunger, they indicate heat stress.",
          },
        ],
      },
      {
        title: 'Colleague Heat Stress Response',
        background: 'A colleague collapses with hot, dry skin.',
        options: [
          {
            text: 'Splash water and try to wake them',
            isCorrect: false,
            isWarning: false,
            feedback: 'These measures are insufficient for severe heat stress.',
          },
          {
            text: 'Call emergency services and start cooling',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Severe heat stress requires immediate medical attention and cooling.',
          },
          {
            text: 'Quickly give them water',
            isCorrect: false,
            isWarning: true,
            feedback: "Don't force water when unconscious, risk of choking.",
          },
        ],
      },
    ],
  },
  {
    title: '🧑‍🏫 School Heatwave Safety Guide',
    scenarios: [
      {
        title: 'PE Class Scheduling',
        background: 'You are a school teacher who needs to arrange outdoor physical activities.',
        options: [
          {
            text: 'Before 10 AM',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Morning has lower temperature and UV intensity.',
          },
          {
            text: '12 PM noon',
            isCorrect: false,
            isWarning: false,
            feedback: 'Noon is the hottest time of day, unsuitable for outdoor activities.',
          },
          {
            text: '3:30 PM',
            isCorrect: false,
            isWarning: true,
            feedback: 'Afternoon temperature is still high, earlier time is recommended.',
          },
        ],
      },
      {
        title: 'Student Dress Code Advice',
        background: 'Students are wearing standard uniforms and need additional protection advice.',
        options: [
          {
            text: 'Wear dark clothes for sun protection',
            isCorrect: false,
            isWarning: false,
            feedback: 'Dark clothes absorb more heat.',
          },
          {
            text: 'Wear hat and light-colored clothes',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! Light-colored clothes reflect heat, and hats provide sun protection.',
          },
          {
            text: 'Drink more soft drinks',
            isCorrect: false,
            isWarning: true,
            feedback: 'Soft drinks are high in sugar and not good for hydration.',
          },
        ],
      },
      {
        title: 'Student Heat Stress Management',
        background: 'A student shows symptoms of headache, flushed face, and rapid heartbeat.',
        options: [
          {
            text: 'Have them lie down, cool down, and notify school nurse',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! These are heat stress symptoms requiring professional medical attention.',
          },
          {
            text: 'Let them rest in classroom',
            isCorrect: false,
            isWarning: false,
            feedback: 'These symptoms need immediate attention, not just rest.',
          },
          {
            text: 'Call parents to pick up',
            isCorrect: false,
            isWarning: true,
            feedback: 'Initial treatment should be given before deciding on medical care.',
          },
        ],
      },
      {
        title: 'Classroom Safety Measures',
        background: 'Ensuring classroom safety during heatwave.',
        options: [
          {
            text: 'Encourage regular water intake',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Regular hydration is more effective than waiting until thirsty.',
          },
          {
            text: 'Distribute ice cream',
            isCorrect: false,
            isWarning: false,
            feedback: 'Ice cream cannot replace water and may affect appetite.',
          },
          {
            text: 'Maintain normal teaching pace',
            isCorrect: false,
            isWarning: true,
            feedback:
              'Teaching schedule needs adjustment during heatwave, monitor student condition.',
          },
        ],
      },
      {
        title: 'School Heatwave Adjustments',
        background: 'School receives heatwave warning and needs to make adjustments.',
        options: [
          {
            text: 'Delay school dismissal time',
            isCorrect: false,
            isWarning: false,
            feedback: 'Delaying dismissal may expose students to high temperatures longer.',
          },
          {
            text: 'Reduce outdoor class duration',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Reducing outdoor activity time lowers heat-related illness risk.',
          },
          {
            text: 'Make no changes',
            isCorrect: false,
            isWarning: true,
            feedback: 'Preventive measures are needed during heatwave to protect student safety.',
          },
        ],
      },
    ],
  },
  {
    title: '🧑‍⚕️ Home Care Heatwave Emergency',
    scenarios: [
      {
        title: 'Diabetic Patient Symptom Recognition',
        background: 'You are a caregiver looking after an elderly diabetic patient.',
        options: [
          {
            text: 'Just dehydration',
            isCorrect: false,
            isWarning: false,
            feedback: 'These symptoms may indicate more serious heat stress reaction.',
          },
          {
            text: 'Possible heatstroke or heat exhaustion',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! These are signs of severe heat stress, requiring immediate cooling measures.',
          },
          {
            text: 'Emotional agitation',
            isCorrect: false,
            isWarning: true,
            feedback: 'These symptoms are not related to emotions, need immediate attention.',
          },
        ],
      },
      {
        title: 'Emergency Situation Management',
        background: 'Patient shows heat stress symptoms.',
        options: [
          {
            text: 'Open windows for ventilation',
            isCorrect: false,
            isWarning: false,
            feedback: 'Ventilation alone is insufficient for heat stress.',
          },
          {
            text: 'Start cooling and check consciousness level',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Physical cooling and consciousness check are crucial.',
          },
          {
            text: 'Let them rest and drink water',
            isCorrect: false,
            isWarning: true,
            feedback: 'These symptoms require more active treatment measures.',
          },
        ],
      },
      {
        title: 'Medication Side Effect Management',
        background: 'Patient shows reduced sweating after taking medication.',
        options: [
          {
            text: 'Continue observation',
            isCorrect: false,
            isWarning: false,
            feedback: 'Need to check if medication affects sweating function.',
          },
          {
            text: 'Check medication side effects',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Some medications may suppress sweating, needs evaluation.',
          },
          {
            text: 'Eat cooling foods',
            isCorrect: false,
            isWarning: true,
            feedback: 'Food cannot solve medication side effect issues.',
          },
        ],
      },
      {
        title: 'Night Temperature Control',
        background: 'Need to determine safe nighttime room temperature.',
        options: [
          {
            text: '28°C',
            isCorrect: false,
            isWarning: false,
            feedback: '28°C is still too high for elderly.',
          },
          {
            text: 'Below 24°C',
            isCorrect: true,
            isWarning: false,
            feedback: 'Correct! Nighttime temperature should be kept below 24°C for safety.',
          },
          {
            text: 'Just using fan is enough',
            isCorrect: false,
            isWarning: true,
            feedback: 'Fan alone may not be sufficient to maintain safe temperature.',
          },
        ],
      },
      {
        title: 'Severe Symptom Management',
        background: 'Patient shows confusion and unclear speech.',
        options: [
          {
            text: 'Force them to drink water',
            isCorrect: false,
            isWarning: false,
            feedback: 'Forcing water when confused is not advisable.',
          },
          {
            text: 'Apply cooling oil',
            isCorrect: false,
            isWarning: false,
            feedback: 'These symptoms require professional medical treatment.',
          },
          {
            text: 'Call emergency services immediately',
            isCorrect: true,
            isWarning: false,
            feedback:
              'Correct! These are neurological symptoms of severe heatstroke, requiring immediate medical attention.',
          },
        ],
      },
    ],
  },
]

const selectedScenario = ref(null)
const currentScenario = ref(0)
const selectedOption = ref(null)
const showFeedback = ref(false)
const quizCompleted = ref(false)
const score = ref(0)

// Get questions array for current scenario
const currentScenarioList = computed(() => {
  if (selectedScenario.value !== null) {
    return scenarioList[selectedScenario.value].scenarios
  }
  return []
})

// Get current question
const currentQuestion = computed(() => {
  return currentScenarioList.value[currentScenario.value]
})

const progressPercentage = computed(() => {
  return currentScenarioList.value.length > 0
    ? ((currentScenario.value + 1) / currentScenarioList.value.length) * 100
    : 0
})

const feedbackIcon = computed(() => {
  if (!currentQuestion.value || selectedOption.value === null) return ''
  const option = currentQuestion.value.options[selectedOption.value]
  if (option.isCorrect) return 'fas fa-check-circle'
  if (option.isWarning) return 'fas fa-exclamation-triangle'
  return 'fas fa-times-circle'
})

const selectScenario = (index) => {
  selectedScenario.value = index
  currentScenario.value = 0
  selectedOption.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
}

const selectOption = (index) => {
  selectedOption.value = index
  showFeedback.value = true
  if (currentQuestion.value.options[index].isCorrect) {
    score.value++
  }
}

const nextScenario = () => {
  if (currentScenario.value < currentScenarioList.value.length - 1) {
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

const returnToQuiz = () => {
  selectedScenario.value = null
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

.scenario-selection {
  text-align: center;
  padding: 20px;
}

.scenario-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.scenario-button {
  padding: 20px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  background-color: white;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-button:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.return-quiz-button {
  background-color: #6c757d;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.return-quiz-button:hover {
  background-color: #5a6268;
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

  .scenario-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
