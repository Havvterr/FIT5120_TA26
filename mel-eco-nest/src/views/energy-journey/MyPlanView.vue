<template>
  <div class="my-plan-view">
    <div v-if="!showResults" class="questionnaire-container">
      <div class="questionnaire-header" data-aos="fade-down">
        <h1>Create Your Energy Efficiency Plan</h1>
        <p>
          Please answer the following questions to help us create a personalized energy-saving plan
          for you. This will help reduce your energy consumption and carbon footprint.
        </p>
      </div>

      <div class="questions-list" data-aos="fade-up">
        <!-- Display questions progressively based on answers -->
        <div
          v-for="(question, questionIndex) in visibleQuestions"
          :key="questionIndex"
          class="question-section"
          data-aos="fade-up"
          :data-aos-delay="100"
        >
          <h3 class="question-text">{{ questionIndex + 1 }}. {{ question.question }}</h3>

          <div class="options-list">
            <div
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              class="option-card"
              :class="{ selected: isSelected(questionIndex, option) }"
              @click="selectOption(questionIndex, option)"
            >
              <div class="option-content">
                <div class="selection-indicator">
                  <div v-if="isSelected(questionIndex, option)" class="check-mark">&#10003;</div>
                  <div v-else class="empty-circle"></div>
                </div>
                <span>{{ option.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="submit-container"
        data-aos="fade-up"
        v-if="currentQuestionIndex >= questions.length - 1"
      >
        <button
          class="submit-button"
          :class="{ 'button-enabled': isFormComplete }"
          :disabled="!isFormComplete"
          @click="generateResults"
        >
          Generate My Energy Plan
        </button>
      </div>
    </div>

    <div v-else class="results-container">
      <div class="results-header" data-aos="fade-down">
        <h1>Your Personalized Energy Efficiency Plan</h1>
        <p>
          Based on your answers, we have created the following energy-saving recommendations for
          you:
        </p>
      </div>

      <div class="plan-actions" data-aos="fade-up">
        <template v-if="personalizedPlans.length > 0">
          <div
            v-for="(plan, index) in personalizedPlans"
            :key="plan.id"
            class="action-card"
            data-aos="fade-up"
            :data-aos-delay="index * 100"
          >
            <div class="action-header">
              <h3>{{ plan.title }}</h3>
              <div class="action-stats">
                <span class="savings">{{ plan.savings }}</span>
                <span class="difficulty">Difficulty: {{ plan.difficulty }}</span>
                <span class="cost">Cost: {{ plan.cost }}</span>
              </div>
            </div>
            <p class="action-description">{{ plan.description }}</p>
          </div>
        </template>
        <div v-else class="no-results" data-aos="fade-up">
          <p>
            We couldn't generate enough recommendations based on your answers. Try changing your
            selections.
          </p>
        </div>
      </div>

      <div class="restart-container" data-aos="fade-up">
        <button class="restart-button" @click="resetQuiz">Start Over</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Base data
const showResults = ref(false)
const currentQuestionIndex = ref(0)
const answers = ref({
  homeType: '',
  residents: '',
  heatTiming: '',
  coolingMethod: [],
  openToNewIdeas: '',
})

// Compute visible questions based on current progress
const visibleQuestions = computed(() => {
  return questions.filter((_, index) => index <= currentQuestionIndex.value)
})

// Quiz questions and options
const questions = [
  {
    id: 'homeType',
    question: 'What kind of place do you call home in the city?',
    options: [
      { value: 'apartment', label: 'Apartment in a high-rise' },
      { value: 'house', label: 'Standalone house with a yard' },
      { value: 'townhouse', label: 'Townhouse or duplex' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    id: 'residents',
    question: 'How many people live in your home?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: 'duo', label: '2 people' },
      { value: 'family', label: '3 to 4 people' },
      { value: 'large', label: '5 or more' },
    ],
  },
  {
    id: 'heatTiming',
    question: 'When does your home feel uncomfortably warm?',
    options: [
      { value: 'afternoon', label: 'Hot afternoons' },
      { value: 'night', label: 'At night when heat lingers' },
      { value: 'allDay', label: 'Almost all day' },
      { value: 'rarely', label: 'It stays cool most of the time' },
    ],
  },
  {
    id: 'coolingMethod',
    question: 'What are you currently using to cool your home?',
    options: [
      { value: 'ac', label: 'Air conditioning' },
      { value: 'fans', label: 'Fans (ceiling or portable)' },
      { value: 'ventilation', label: 'Natural ventilation (open windows)' },
      { value: 'shading', label: 'Shading curtains or rooftop paint' },
      { value: 'none', label: 'None of the above' },
    ],
    multiSelect: true,
  },
  {
    id: 'openToNewIdeas',
    question: 'Are you open to trying new energy-saving actions?',
    options: [
      { value: 'veryOpen', label: 'Yes, actively looking for ideas' },
      { value: 'somewhatOpen', label: 'Maybe, if affordable and easy' },
      { value: 'neutral', label: 'Not sure yet' },
      { value: 'notOpen', label: "No, I'm satisfied with current setup" },
    ],
  },
]

// Energy saving plans database
const allEnergyPlans = [
  // Cooling Solutions
  {
    id: 'ceiling-fans',
    title: 'Install Energy-Efficient Ceiling Fans',
    description:
      'Ceiling fans use much less electricity than air conditioners and can make a room feel 4°C cooler.',
    savings: 'Up to 40% on cooling costs',
    difficulty: 'Medium',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      residents: ['solo', 'duo', 'family', 'large'],
      heatTiming: ['afternoon', 'night', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'programmable-thermostat',
    title: 'Install a Programmable Thermostat',
    description:
      "Set higher temperatures when you're away and cooler temperatures when you're home.",
    savings: 'Up to 10% on heating and cooling',
    difficulty: 'Easy',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'window-films',
    title: 'Apply Reflective Window Films',
    description: 'Reduces solar heat gain while still allowing light to enter your home.',
    savings: 'Up to 30% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'evening-cooling',
    title: 'Strategic Evening Cooling',
    description:
      "Open windows at night when it's cooler and close them before it gets hot in the morning.",
    savings: 'Up to 20% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      heatTiming: ['afternoon', 'night'],
      coolingMethod: ['ventilation', 'fans'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'roof-painting',
    title: 'Cool Roof Coating',
    description: 'Apply reflective white coating to your roof to reduce heat absorption.',
    savings: 'Up to 20% on cooling costs',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['allDay', 'afternoon'],
      openToNewIdeas: ['veryOpen'],
    },
  },

  // Shading Solutions
  {
    id: 'window-awnings',
    title: 'Install External Window Awnings',
    description:
      'Blocks direct sunlight before it enters your windows, especially effective for west-facing windows.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Medium',
    cost: '$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['afternoon'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'thermal-curtains',
    title: 'Use Thermal or Blackout Curtains',
    description:
      'These specialized curtains block heat and light more effectively than standard curtains.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'strategic-landscaping',
    title: 'Strategic Tree Planting',
    description:
      'Plant deciduous trees on the east and west sides of your home for natural shading.',
    savings: 'Up to 25% on cooling costs',
    difficulty: 'Medium',
    cost: '$$',
    applicableFor: {
      homeType: ['house'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },

  // Ventilation Improvements
  {
    id: 'whole-house-fan',
    title: 'Install a Whole-House Fan',
    description:
      'Pulls cool outside air in through windows while exhausting hot air through the attic.',
    savings: 'Up to 50% on cooling costs',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['night', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },
  {
    id: 'cross-ventilation',
    title: 'Optimize Cross-Ventilation',
    description: 'Position fans to create a cooling breeze across your living space.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free or $',
    applicableFor: {
      coolingMethod: ['fans', 'ventilation'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Insulation Solutions
  {
    id: 'weatherstripping',
    title: 'Seal Gaps with Weatherstripping',
    description: 'Prevent cool air from escaping through gaps around doors and windows.',
    savings: 'Up to 10% on cooling and heating',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'attic-insulation',
    title: 'Improve Attic Insulation',
    description: 'Adding proper insulation to your attic creates a barrier against heat transfer.',
    savings: 'Up to 20% on cooling and heating',
    difficulty: 'Medium to Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['allDay', 'night'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },

  // Appliance and Usage Modifications
  {
    id: 'ac-maintenance',
    title: 'Regular AC Maintenance',
    description: 'Clean or replace filters monthly and schedule professional maintenance annually.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'smart-thermostat',
    title: 'Smart Thermostat with Learning Capabilities',
    description:
      'Learns your schedule and preferences to optimize heating and cooling automatically.',
    savings: 'Up to 15% on heating and cooling',
    difficulty: 'Easy',
    cost: '$$',
    applicableFor: {
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'led-lighting',
    title: 'Switch to LED Lighting',
    description: 'LEDs generate less heat and use less energy than incandescent bulbs.',
    savings: 'Up to 75% on lighting costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'cooking-habits',
    title: 'Adjust Cooking Habits',
    description:
      'Use microwave or outdoor grill instead of oven during hot days to reduce indoor heat.',
    savings: 'Varies',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['duo', 'family', 'large'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'peak-hour-usage',
    title: 'Shift Energy Use to Off-Peak Hours',
    description: "Run major appliances during early morning or late evening when it's cooler.",
    savings: 'Up to 10% on energy bills',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },

  // High Efficiency Solutions
  {
    id: 'energy-audit',
    title: 'Professional Energy Audit',
    description:
      "Get a comprehensive analysis of your home's energy use with specific recommendations.",
    savings: 'Potential for 30%+ based on findings',
    difficulty: 'Easy (for you)',
    cost: '$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      openToNewIdeas: ['veryOpen'],
    },
  },
  {
    id: 'energy-star-ac',
    title: 'Upgrade to ENERGY STAR Air Conditioner',
    description: 'Modern units use up to 50% less energy than models from 15 years ago.',
    savings: 'Up to 50% on cooling costs',
    difficulty: 'Medium',
    cost: '$$$',
    applicableFor: {
      coolingMethod: ['ac', 'none'],
      openToNewIdeas: ['veryOpen'],
    },
  },
  {
    id: 'evaporative-cooler',
    title: 'Consider an Evaporative Cooler',
    description: 'Uses up to 75% less electricity than air conditioning in dry climates.',
    savings: 'Up to 75% compared to AC',
    difficulty: 'Medium',
    cost: '$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },
]

// Set answer for selected option
const selectOption = (questionIndex, option) => {
  const questionId = questions[questionIndex].id

  if (questions[questionIndex].multiSelect) {
    // Handle multi-select questions
    if (!answers.value[questionId]) {
      answers.value[questionId] = []
    }

    const index = answers.value[questionId].indexOf(option.value)
    if (index === -1) {
      answers.value[questionId].push(option.value)
    } else {
      answers.value[questionId].splice(index, 1)
    }
  } else {
    // Handle single-select questions
    answers.value[questionId] = option.value

    // If this is not the last question, proceed to the next one
    if (questionIndex < questions.length - 1) {
      // After answering the current question, if it's the last visible question, automatically advance to the next one
      if (questionIndex === currentQuestionIndex.value) {
        currentQuestionIndex.value++

        // Auto-scroll to the newly displayed question
        setTimeout(() => {
          const newQuestion = document.querySelector(
            `.question-section:nth-child(${currentQuestionIndex.value + 1})`,
          )
          if (newQuestion) {
            newQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }
}

// Check if option is selected
const isSelected = (questionIndex, option) => {
  const questionId = questions[questionIndex].id

  if (questions[questionIndex].multiSelect) {
    return answers.value[questionId] && answers.value[questionId].includes(option.value)
  } else {
    return answers.value[questionId] === option.value
  }
}

// Watch for changes to the multi-select cooling method question, advance when at least one option is selected
watch(
  () => answers.value.coolingMethod,
  (newValue) => {
    // Check if this is the currently visible last question
    const coolingMethodIndex = questions.findIndex((q) => q.id === 'coolingMethod')
    if (coolingMethodIndex === currentQuestionIndex.value && newValue.length > 0) {
      // Only advance if there is a selection
      if (currentQuestionIndex.value < questions.length - 1) {
        currentQuestionIndex.value++

        // Auto-scroll to the newly displayed question
        setTimeout(() => {
          const newQuestion = document.querySelector(
            `.question-section:nth-child(${currentQuestionIndex.value + 1})`,
          )
          if (newQuestion) {
            newQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  },
  { deep: true },
)

// Check if form is complete and can be submitted
const isFormComplete = computed(() => {
  // Check that all required single-select questions are answered
  const singleSelectAnswered = questions
    .filter((q) => !q.multiSelect)
    .every((q) => answers.value[q.id] && answers.value[q.id].length > 0)

  // Check that multi-select questions have at least one option selected
  const multiSelectAnswered = questions
    .filter((q) => q.multiSelect)
    .every((q) => answers.value[q.id] && answers.value[q.id].length > 0)

  return singleSelectAnswered && multiSelectAnswered
})

// Generate personalized plan results
const generateResults = () => {
  showResults.value = true
}

// Calculate personalized plans based on user answers
const personalizedPlans = computed(() => {
  if (!showResults.value) return []

  // Score each plan based on how well it matches the user's situation
  const scoredPlans = allEnergyPlans.map((plan) => {
    let score = 0
    let matchesRequired = false

    // Check home type match
    if (
      plan.applicableFor.homeType &&
      plan.applicableFor.homeType.includes(answers.value.homeType)
    ) {
      score += 2
      matchesRequired = true
    }

    // Check residents match
    if (
      plan.applicableFor.residents &&
      plan.applicableFor.residents.includes(answers.value.residents)
    ) {
      score += 1
      matchesRequired = true
    }

    // Check heat timing match
    if (
      plan.applicableFor.heatTiming &&
      plan.applicableFor.heatTiming.includes(answers.value.heatTiming)
    ) {
      score += 2
      matchesRequired = true
    }

    // Check cooling method match
    if (plan.applicableFor.coolingMethod && answers.value.coolingMethod) {
      const methodsMatch = answers.value.coolingMethod.some((method) =>
        plan.applicableFor.coolingMethod.includes(method),
      )
      if (methodsMatch) {
        score += 3
        matchesRequired = true
      }
    }

    // Check openness to new ideas
    if (
      plan.applicableFor.openToNewIdeas &&
      plan.applicableFor.openToNewIdeas.includes(answers.value.openToNewIdeas)
    ) {
      score += 1
      matchesRequired = true
    }

    return {
      ...plan,
      score,
      matchesRequired,
    }
  })

  // Filter plans that match at least one criterion and sort by score
  const eligiblePlans = scoredPlans
    .filter((plan) => plan.matchesRequired)
    .sort((a, b) => b.score - a.score)

  // Take top 8 plans to ensure we have enough after diversity filtering
  const topPlans = eligiblePlans.slice(0, 8)

  // Ensure diversity of solutions by categorizing and selecting from different categories
  const categorized = {}

  topPlans.forEach((plan) => {
    // Extract category from plan ID as a simple way to categorize
    const category = plan.id.split('-')[0]
    if (!categorized[category]) {
      categorized[category] = []
    }
    categorized[category].push(plan)
  })

  // Select at most 2 from each category to ensure diversity
  let diversePlans = []
  Object.values(categorized).forEach((categoryPlans) => {
    diversePlans = diversePlans.concat(categoryPlans.slice(0, 2))
  })

  // Sort by score and take top 6 plans
  return diversePlans.sort((a, b) => b.score - a.score).slice(0, 6)
})

// Reset the quiz
const resetQuiz = () => {
  showResults.value = false
  currentQuestionIndex.value = 0
  answers.value = {
    homeType: '',
    residents: '',
    heatTiming: '',
    coolingMethod: [],
    openToNewIdeas: '',
  }
}

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
  })
})
</script>

<style scoped>
.my-plan-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.questionnaire-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.questionnaire-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.questionnaire-header h1 {
  color: #2d3748;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.questionnaire-header p {
  color: #718096;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.question-section {
  margin-bottom: 3rem;
}

.question-text {
  font-size: 1.6rem;
  color: #2d3748;
  margin-bottom: 1.75rem;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.options-list {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: space-between;
}

.option-card {
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 0; /* Prevent content overflow */
  min-height: 80px;
  display: flex;
  align-items: center;
}

.option-card:hover {
  border-color: #4299e1;
  background-color: #ebf8ff;
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border-color: #48bb78;
  background-color: #f0fff4;
  box-shadow: 0 4px 8px rgba(72, 187, 120, 0.2);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.selection-indicator {
  flex-shrink: 0;
}

.check-mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #48bb78;
  background-color: #48bb78;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.empty-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #cbd5e0;
}

.option-content span {
  font-size: 1.2rem;
  font-weight: 500;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.submit-button {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.3);
}

.submit-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 10px rgba(66, 153, 225, 0.4);
}

.submit-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-enabled {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

.results-container {
  padding: 2rem 0;
}

.results-header {
  text-align: center;
  margin-bottom: 3rem;
}

.results-header h1 {
  font-size: 2.2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.results-header p {
  color: #718096;
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
}

.plan-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.action-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
}

.action-header {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  padding: 1.5rem;
  color: white;
}

.action-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.action-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.savings {
  font-size: 0.9rem;
  background-color: rgba(72, 187, 120, 0.2);
  color: #2f855a;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.difficulty,
.cost {
  font-size: 0.9rem;
  background-color: rgba(160, 174, 192, 0.2);
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.action-description {
  color: #4a5568;
  padding: 1.75rem;
  line-height: 1.6;
  flex-grow: 1;
  font-size: 1.1rem;
}

.no-results {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.restart-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

.restart-button {
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.restart-button:hover {
  background-color: #e2e8f0;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .options-list {
    flex-direction: column;
    gap: 1.25rem;
  }

  .action-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-card {
    min-height: 60px;
  }

  .question-text {
    font-size: 1.4rem;
  }

  .submit-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }
}
</style>
