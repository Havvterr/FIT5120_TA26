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

      <div class="goal-items">
        <template v-if="personalizedPlans.length > 0">
          <div
            v-for="plan in personalizedPlans"
            :key="plan.id"
            class="goal-item"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div class="goal-status">
              <i class="fas fa-lightbulb"></i>
            </div>
            <div class="goal-content">
              <h3>{{ plan.title }}</h3>
              <div class="goal-details">
                <p class="plan-description">{{ plan.description }}</p>
                <div class="goal-meta">
                  <span class="goal-impact"><i class="fas fa-leaf"></i> {{ plan.savings }}</span>
                  <span class="goal-target"
                    ><i class="fas fa-bullseye"></i> Target: {{ getPlanTarget(plan) }}</span
                  >
                </div>
              </div>
            </div>
            <div class="goal-action">
              <button v-if="!isTracked(plan.id)" class="track-button" @click="trackGoal(plan)">
                <i class="fas fa-plus"></i>
                Track Goal
              </button>
              <button v-else class="untrack-button" @click="untrackGoal(plan.id)">
                <i class="fas fa-times"></i>
                Untrack Goal
              </button>
            </div>
          </div>
        </template>
        <div v-else class="no-results">
          <p>
            We couldn't generate enough recommendations based on your answers. Try changing your
            selections.
          </p>
        </div>
      </div>

      <div class="restart-container">
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

// Storage keys
const STORAGE_KEY = 'energy_tracker_goals'
const LEGACY_KEY = 'trackedGoals'

// Tracked goals data
const trackedGoals = ref([])

// Check if a plan is already being tracked
const isTracked = (planId) => {
  return trackedGoals.value.some((goal) => goal.id === planId)
}

// Save goals to localStorage - Save to both keys for compatibility
const saveGoals = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedGoals.value))
    localStorage.setItem(LEGACY_KEY, JSON.stringify(trackedGoals.value))
  } catch (e) {
    console.error('Unable to save goal data:', e)
  }
}

// Load data from localStorage
const loadGoals = () => {
  try {
    // Try new storage key first
    let savedGoals = localStorage.getItem(STORAGE_KEY)
    if (!savedGoals) {
      // If not found, try legacy key
      savedGoals = localStorage.getItem(LEGACY_KEY)
    }

    if (savedGoals) {
      trackedGoals.value = JSON.parse(savedGoals)
      console.log('MyPlanView: Successfully loaded', trackedGoals.value.length, 'goals')
    } else {
      console.log('MyPlanView: No saved goal data found')
    }
  } catch (e) {
    console.error('MyPlanView: Error loading goal data:', e)
  }
}

// Add plan to tracking list
const trackGoal = (plan) => {
  if (!isTracked(plan.id)) {
    const newGoal = {
      ...plan,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      isCompleted: false,
      progress: 0,
    }
    trackedGoals.value.push(newGoal)

    // Save to localStorage
    saveGoals()
  }
}

// Untrack a goal
const untrackGoal = (goalId) => {
  const goalIndex = trackedGoals.value.findIndex((goal) => goal.id === goalId)
  if (goalIndex !== -1) {
    trackedGoals.value.splice(goalIndex, 1)

    // Save to localStorage
    saveGoals()
  }
}

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
  // Lighting & Electrical Solutions
  {
    id: 'led-lighting',
    title: 'Replace All Lights with Energy-Efficient LEDs',
    description:
      'LED bulbs use up to 90% less energy than traditional incandescent bulbs and last up to 25 times longer.',
    savings: 'Up to 15% on electricity bills',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'smart-thermostat',
    title: 'Install Smart Programmable Thermostat',
    description:
      'Smart thermostats learn your schedule and automatically adjust temperature settings for optimal comfort and efficiency.',
    savings: 'Up to 10% on heating and cooling',
    difficulty: 'Moderate',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'smart-power-strips',
    title: 'Use Smart Power Strips to Eliminate Standby Power',
    description:
      'Automatically cut power to devices when they\'re not in use, eliminating "phantom" energy consumption.',
    savings: 'Up to 5% on electricity bills',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'timed-outlets',
    title: 'Install Timer Outlets for Scheduled Power Control',
    description:
      'Set specific times for devices to turn on and off, ensuring they only use power when needed.',
    savings: 'Up to 3% on electricity bills',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'natural-lighting',
    title: 'Maximize Natural Daylight Usage',
    description:
      'Rearrange furniture and keep windows clean to maximize natural light and reduce the need for artificial lighting.',
    savings: 'Up to 5% on lighting costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      heatTiming: ['rarely', 'night'],
      coolingMethod: ['ventilation', 'fans', 'shading'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Insulation & Energy Retention
  {
    id: 'weatherstripping',
    title: 'Install Weather Stripping on Doors and Windows',
    description:
      'Seal gaps around doors and windows to prevent air leakage, keeping cool air in during summer and warm air in during winter.',
    savings: 'Up to 15% on heating and cooling',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'insulation',
    title: 'Add Insulation to Walls and Ceiling',
    description:
      'Proper insulation creates a thermal barrier that reduces heat transfer, keeping your home cooler in summer and warmer in winter.',
    savings: 'Up to 20% on heating and cooling',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },

  // Heat Reduction Strategies
  {
    id: 'window-curtains',
    title: 'Install Thermal Curtains or Blinds',
    description:
      'Block direct sunlight during hot periods while still allowing ambient light to enter, significantly reducing indoor temperature.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Easy',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      heatTiming: ['afternoon', 'allDay'],
      coolingMethod: ['ac', 'fans', 'ventilation', 'shading'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'window-film',
    title: 'Apply Reflective Window Film',
    description:
      'Heat-rejecting window films block up to 80% of solar heat without blocking light, reducing indoor temperatures and UV damage.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Moderate',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      coolingMethod: ['ac', 'fans', 'shading'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'roof-garden',
    title: 'Create Rooftop or Balcony Green Space',
    description:
      'Plants absorb heat and provide shade, while evaporation from soil and leaves creates natural cooling.',
    savings: 'Up to 8% on cooling costs',
    difficulty: 'Moderate',
    cost: '$$',
    applicableFor: {
      homeType: ['house', 'townhouse', 'apartment'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'reflective-paint',
    title: 'Apply Cool-Colored Paint to Exterior Walls',
    description:
      'Light-colored, reflective exterior paints can reject up to 90% of solar heat, keeping interior temperatures lower.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },
  {
    id: 'window-awnings',
    title: 'Install Window Awnings or Overhangs',
    description:
      'External shading prevents direct sunlight from reaching and heating windows, creating cooler indoor temperatures.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Moderate',
    cost: '$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      heatTiming: ['afternoon'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'indoor-plants',
    title: 'Add Indoor Plants for Natural Cooling',
    description:
      'Plants release moisture into the air through transpiration, creating a natural cooling effect and improving air quality.',
    savings: 'Up to 3% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Appliance Efficiency
  {
    id: 'hang-drying',
    title: 'Air Dry Clothes Instead of Using Dryer',
    description:
      'Hang clothes to dry naturally instead of using an energy-intensive dryer. Outdoor drying in the sun also has antimicrobial benefits.',
    savings: 'Up to 5% on electricity bills',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'defrost-fridge',
    title: 'Regularly Defrost Your Refrigerator',
    description:
      'Even a thin layer of ice in your freezer can increase energy consumption by 10%. Regular defrosting keeps your appliance running efficiently.',
    savings: 'Up to 5% on refrigeration costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Ventilation Strategies
  {
    id: 'day-night-ventilation',
    title: 'Implement Day-Night Ventilation Strategy',
    description:
      'Close windows during hot daylight hours and open them during cooler evening and night hours to flush accumulated heat.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      heatTiming: ['afternoon', 'allDay'],
      coolingMethod: ['fans', 'ventilation'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'night-cooling',
    title: 'Use Late Night Natural Cooling',
    description:
      'Take advantage of cooler temperatures between midnight and early morning by opening windows and using fans to draw in cool air.',
    savings: 'Up to 8% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      heatTiming: ['night', 'allDay'],
      coolingMethod: ['fans', 'ventilation'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
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

// Get target based on plan type
const getPlanTarget = (plan) => {
  const category = plan.id.split('-')[0]

  switch (category) {
    case 'led':
      return 'Reduce lighting costs by 80%'
    case 'smart':
      return 'Optimize temperature control by 25%'
    case 'window':
      return 'Reduce indoor heat gain by 40%'
    case 'roof':
      return 'Lower cooling costs by 30%'
    case 'reflective':
      return 'Reduce surface temperature by 30°C'
    case 'natural':
      return 'Cut artificial lighting use by 25%'
    case 'weatherstripping':
      return 'Eliminate 90% of drafts around openings'
    case 'insulation':
      return 'Reduce heat transfer by 60%'
    case 'indoor':
      return 'Improve air quality and reduce temperature by 2-3°C'
    case 'hang':
      return 'Eliminate 100% of dryer energy usage'
    case 'defrost':
      return 'Improve refrigerator efficiency by 15%'
    case 'day':
      return 'Reduce indoor temperature by up to 5°C'
    case 'night':
      return 'Lower cooling costs by 20% overnight'
    case 'timed':
      return 'Eliminate standby power by 95%'
    default:
      return 'Reduce energy consumption significantly'
  }
}

onMounted(() => {
  // Initialize animations
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true, // Set to true, animation plays only once
  })

  // Load tracked plans from localStorage
  loadGoals()
})
</script>

<style scoped>
.my-plan-view {
  max-width: 1400px;
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
  gap: 2rem;
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
  transition:
    all 0.5s ease,
    background 0.5s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(66, 153, 225, 0.3);
}

.submit-button:hover {
  background: #14642e;
  transform: translateY(-3px);
  box-shadow: 0 6px 10px rgba(3, 76, 38, 0.4);
}

.submit-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  transition: none;
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
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
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

.goal-items {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.goal-item {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  gap: 2rem;
  width: 100%;
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.goal-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.goal-status {
  font-size: 1.8rem;
  display: flex;
  align-items: flex-start;
  padding-top: 0.5rem;
}

.goal-status i {
  color: #1296d3;
}

.goal-content {
  flex: 1;
}

.goal-content h3 {
  margin: 0 0 1rem 0;
  color: #1e6a93;
  font-size: 1.5rem;
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-description {
  color: #2e333b;
  line-height: 1.5;
  font-size: 1.1rem;
  margin: 0;
}

.goal-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.goal-impact,
.goal-target {
  color: #535e6e;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.goal-impact {
  color: #0f6c18;
  font-weight: 500;
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
  background-color: #3182ce;
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    all 0.5s ease,
    background-color 0.5s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.restart-button:hover {
  background-color: #14642e;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(3, 76, 38, 0.3);
}

.goal-action {
  position: absolute;
  top: 2rem;
  right: 2rem;
}

.track-button {
  background: #1e6a93;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.track-button:hover {
  background: #165a7d;
}

.untrack-button {
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.25rem;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.untrack-button:hover {
  background: #c53030;
}

@media (max-width: 768px) {
  .options-list {
    flex-direction: column;
    gap: 1.25rem;
  }

  .goal-item {
    flex-direction: column;
    gap: 1rem;
  }

  .goal-status {
    justify-content: center;
  }

  .goal-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .submit-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }

  .goal-items {
    max-width: 95%;
    padding: 0 1rem;
    gap: 2rem;
  }

  .goal-item {
    padding: 1.5rem;
  }

  .goal-action {
    position: static;
    margin-top: 1rem;
    width: 100%;
  }

  .track-button {
    width: 100%;
    justify-content: center;
  }
}

@media (min-width: 1200px) {
  .goal-items {
    max-width: 1200px;
  }

  .results-container {
    max-width: 1300px;
  }

  .my-plan-view {
    max-width: 1400px;
  }
}
</style>
