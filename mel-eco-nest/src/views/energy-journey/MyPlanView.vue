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
      { value: 'shading', label: 'Shading/reflective curtains or rooftop paint' },
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

  // New additions: Smart Home Solutions
  {
    id: 'smart-blinds',
    title: 'Install Automated Smart Blinds',
    description:
      'Automatically adjust blinds based on sunlight and temperature to optimize cooling and heating.',
    savings: 'Up to 15% on cooling and heating',
    difficulty: 'Medium',
    cost: '$$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'smart-power-strips',
    title: 'Use Smart Power Strips',
    description:
      'Automatically cut power to devices in standby mode, reducing phantom energy usage.',
    savings: 'Up to 10% on electricity bills',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'home-energy-monitor',
    title: 'Install a Home Energy Monitor',
    description:
      'Track your energy usage in real-time to identify energy hogs and optimize usage patterns.',
    savings: 'Up to 15% on total energy costs',
    difficulty: 'Easy',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      residents: ['duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },

  // Apartment-Specific Solutions
  {
    id: 'apartment-balcony-shade',
    title: 'Create Balcony Shade with Plants or Screens',
    description:
      'Use potted plants or shade screens on balconies to block direct sunlight from entering windows.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment'],
      heatTiming: ['afternoon'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'portable-ac-optimization',
    title: 'Optimize Portable Air Conditioner Placement',
    description:
      'Position portable AC units strategically and ensure proper venting to maximize efficiency.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'other'],
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Single-Person Household Solutions
  {
    id: 'zone-cooling',
    title: 'Implement Zone Cooling',
    description:
      'Focus cooling efforts only on the rooms you actively use instead of the entire home.',
    savings: 'Up to 30% on cooling costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo'],
      coolingMethod: ['ac', 'fans'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },

  // Large Family Solutions
  {
    id: 'family-energy-challenge',
    title: 'Start a Family Energy-Saving Challenge',
    description:
      'Create a game or challenge with rewards to encourage family members to adopt energy-saving habits.',
    savings: 'Up to 20% on total energy costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'staggered-appliance-use',
    title: 'Implement Staggered Appliance Usage',
    description:
      'Avoid running multiple high-energy appliances simultaneously to reduce peak demand charges.',
    savings: 'Up to 10% on electricity bills',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },

  // Low-Cost Quick Wins
  {
    id: 'ceiling-fan-direction',
    title: 'Optimize Ceiling Fan Direction',
    description: 'Set fans to rotate counterclockwise in summer to create a cooling downdraft.',
    savings: 'Up to 15% on cooling costs',
    difficulty: 'Very Easy',
    cost: 'Free',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      coolingMethod: ['fans'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'refrigerator-maintenance',
    title: 'Optimize Refrigerator Settings and Maintenance',
    description:
      'Clean coils, check door seals, and set optimal temperatures to reduce energy consumption.',
    savings: 'Up to 15% on refrigerator energy use',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },

  // Natural Cooling Solutions
  {
    id: 'green-roof',
    title: 'Install a Green Roof or Rooftop Garden',
    description:
      'Grow plants on your roof to provide natural insulation and reduce heat absorption.',
    savings: 'Up to 25% on cooling costs',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },
  {
    id: 'cool-paving',
    title: 'Use Cool Paving for Driveways and Walkways',
    description: 'Replace dark, heat-absorbing pavement with reflective or permeable materials.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house'],
      heatTiming: ['afternoon', 'allDay'],
      openToNewIdeas: ['veryOpen'],
    },
  },

  // Technological Solutions
  {
    id: 'smart-ceiling-fans',
    title: 'Install Smart Ceiling Fans with Sensors',
    description:
      'Advanced fans that automatically adjust speed based on room occupancy and temperature.',
    savings: 'Up to 20% on cooling costs',
    difficulty: 'Medium',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      coolingMethod: ['fans'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'window-sensors',
    title: 'Install Window and Door Sensors',
    description: 'Alerts you when windows or doors are left open while AC is running.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Easy',
    cost: '$$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse'],
      coolingMethod: ['ac'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },

  // Behavioral Solutions
  {
    id: 'clothing-adaptation',
    title: 'Adapt Clothing Choices for Indoor Comfort',
    description:
      'Wear lightweight, breathable clothing at home to stay comfortable at higher thermostat settings.',
    savings: 'Up to 10% on cooling costs',
    difficulty: 'Very Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral', 'notOpen'],
    },
  },
  {
    id: 'cold-meals',
    title: 'Prepare Cold Meals During Hot Days',
    description:
      'Reduce indoor heat generation by preparing meals that do not require cooking during peak heat hours.',
    savings: 'Up to 5% on cooling and cooking energy',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      heatTiming: ['afternoon', 'allDay'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },

  // Special Situations
  {
    id: 'night-cooling-apartment',
    title: 'Create a Night Cooling System for Apartments',
    description:
      'Use window fans strategically at night to pull in cool air, particularly effective for upper floor apartments.',
    savings: 'Up to 25% on cooling costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment'],
      heatTiming: ['night', 'allDay'],
      coolingMethod: ['fans', 'ventilation'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },

  // Advanced Technical Solutions
  {
    id: 'phase-change-materials',
    title: 'Install Phase Change Materials',
    description:
      'These advanced materials absorb and release heat as they change phase, helping to regulate indoor temperatures.',
    savings: 'Up to 20% on heating and cooling',
    difficulty: 'Hard',
    cost: '$$$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      openToNewIdeas: ['veryOpen'],
    },
  },

  // Economic Solutions
  {
    id: 'community-solar',
    title: 'Join a Community Solar Program',
    description:
      'Subscribe to a shared solar farm to offset your electricity use with renewable energy.',
    savings: 'Up to 15% on electricity bills',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['apartment', 'house', 'townhouse', 'other'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },
  {
    id: 'time-of-use-plan',
    title: 'Switch to a Time-of-Use Electricity Rate Plan',
    description:
      'Change to a utility plan that offers lower rates during off-peak hours, then shift your usage accordingly.',
    savings: 'Up to 20% on electricity bills',
    difficulty: 'Medium',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen'],
    },
  },

  // Water-Energy Nexus Solutions
  {
    id: 'water-heater-timer',
    title: 'Install a Water Heater Timer',
    description: 'Set your water heater to run only during times when you need hot water.',
    savings: 'Up to 15% on water heating costs',
    difficulty: 'Easy',
    cost: '$',
    applicableFor: {
      homeType: ['house', 'townhouse'],
      residents: ['solo', 'duo', 'family', 'large'],
      openToNewIdeas: ['veryOpen', 'somewhatOpen', 'neutral'],
    },
  },
  {
    id: 'shorter-showers',
    title: 'Take Shorter, Cooler Showers',
    description:
      'Reduce hot water usage to save on water heating energy, which is typically 18% of home energy use.',
    savings: 'Up to 10% on water heating costs',
    difficulty: 'Easy',
    cost: 'Free',
    applicableFor: {
      residents: ['solo', 'duo', 'family', 'large'],
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
    console.log(`Updated multi-select answer for ${questionId}:`, answers.value[questionId])
  } else {
    // Handle single-select questions
    answers.value[questionId] = option.value
    console.log(`Selected answer for ${questionId}:`, option.value)

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

  console.log('Generating plans with answers:', JSON.stringify(answers.value))

  // Score each plan based on how well it matches the user's situation
  const scoredPlans = allEnergyPlans.map((plan) => {
    let score = 0
    let matchesRequired = false
    let matches = []

    // Check home type match - high importance
    if (
      plan.applicableFor.homeType &&
      plan.applicableFor.homeType.includes(answers.value.homeType)
    ) {
      score += 5 // Increased weight
      matchesRequired = true
      matches.push('homeType')
    } else if (plan.applicableFor.homeType) {
      // Penalize if home type doesn't match but plan has home type requirement
      score -= 3
    }

    // Check residents match - medium importance
    if (
      plan.applicableFor.residents &&
      plan.applicableFor.residents.includes(answers.value.residents)
    ) {
      score += 3 // Increased weight
      matchesRequired = true
      matches.push('residents')
    }

    // Check heat timing match - high importance
    if (
      plan.applicableFor.heatTiming &&
      plan.applicableFor.heatTiming.includes(answers.value.heatTiming)
    ) {
      score += 4 // Increased weight
      matchesRequired = true
      matches.push('heatTiming')
    } else if (plan.applicableFor.heatTiming) {
      // Penalize if heat timing doesn't match but plan has heat timing requirement
      score -= 2
    }

    // Check cooling method match - highest importance
    if (plan.applicableFor.coolingMethod && answers.value.coolingMethod) {
      const methodsMatch = answers.value.coolingMethod.some((method) =>
        plan.applicableFor.coolingMethod.includes(method),
      )
      if (methodsMatch) {
        score += 6 // Increased weight
        matchesRequired = true
        matches.push('coolingMethod')
      } else {
        // Penalize if no cooling methods match
        score -= 4
      }
    }

    // Check openness to new ideas - impacts all recommendations
    if (
      plan.applicableFor.openToNewIdeas &&
      plan.applicableFor.openToNewIdeas.includes(answers.value.openToNewIdeas)
    ) {
      score += 2
      matchesRequired = true
      matches.push('openToNewIdeas')
    } else if (plan.applicableFor.openToNewIdeas) {
      // Significant penalty if user isn't open to this level of change
      score -= 5
    }

    // Additional weighting for specific combinations
    if (matches.includes('homeType') && matches.includes('heatTiming')) {
      score += 2 // Bonus for solutions that match both home type and heat timing
    }

    if (matches.includes('coolingMethod') && matches.includes('openToNewIdeas')) {
      score += 2 // Bonus for cooling solutions that match user's openness
    }

    return {
      ...plan,
      score,
      matchesRequired,
      matches,
    }
  })

  // More strict filtering - require positive score and at least one match
  const eligiblePlans = scoredPlans
    .filter((plan) => plan.matchesRequired && plan.score > 0)
    .sort((a, b) => b.score - a.score)

  console.log('Eligible plans count:', eligiblePlans.length)

  if (eligiblePlans.length > 0) {
    console.log('Top 3 scoring plans:')
    eligiblePlans.slice(0, 3).forEach((plan, idx) => {
      console.log(
        `${idx + 1}. ${plan.title} (score: ${plan.score}, matches: ${plan.matches.join(', ')})`,
      )
    })
  } else {
    console.log('No eligible plans found!')
  }

  // Take top plans to ensure we have enough after diversity filtering
  const topPlans = eligiblePlans.slice(0, 15) // Increased from 8 to 15 to get more variety

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

  console.log('Categories found:', Object.keys(categorized).join(', '))

  // Select at most 2 from each category to ensure diversity
  let diversePlans = []
  Object.values(categorized).forEach((categoryPlans) => {
    diversePlans = diversePlans.concat(categoryPlans.slice(0, 2))
  })

  // If we don't have enough plans after diversity filtering, add more from top scoring
  if (diversePlans.length < 6 && eligiblePlans.length > diversePlans.length) {
    const additionalPlans = eligiblePlans
      .filter((plan) => !diversePlans.some((p) => p.id === plan.id))
      .slice(0, 8 - diversePlans.length)

    diversePlans = diversePlans.concat(additionalPlans)
    console.log('Added additional plans to reach minimum count')
  }

  // Sort by score and return the top plans (or fewer if not enough eligible)
  // Increased from 6 to 8 plans to show more options
  const finalPlans = diversePlans.sort((a, b) => b.score - a.score).slice(0, 8)
  console.log('Final plans selected:', finalPlans.map((p) => p.title).join(', '))

  return finalPlans
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

  // Check if allEnergyPlans is properly defined
  console.log('Energy plans available:', allEnergyPlans.length)
  console.log('First energy plan:', allEnergyPlans[0]?.title)

  // Print a few examples of applicableFor criteria to verify matching logic
  allEnergyPlans.slice(0, 3).forEach((plan) => {
    console.log(`Plan "${plan.title}" criteria:`, JSON.stringify(plan.applicableFor))
  })
})
</script>

<style scoped>
.my-plan-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.questionnaire-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.questionnaire-header {
  text-align: center;
  margin-bottom: 2rem;
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
  gap: 3rem;
}

.question-section {
  margin-bottom: 2rem;
}

.question-text {
  font-size: 1.4rem;
  color: #2d3748;
  margin-bottom: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.options-list {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
}

.option-card {
  background-color: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 0; /* Prevent content overflow */
}

.option-card:hover {
  border-color: #4299e1;
  background-color: #ebf8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.option-card.selected {
  border-color: #48bb78;
  background-color: #f0fff4;
  box-shadow: 0 2px 6px rgba(72, 187, 120, 0.2);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selection-indicator {
  flex-shrink: 0;
}

.check-mark {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #48bb78;
  background-color: #48bb78;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.empty-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #cbd5e0;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.submit-button {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
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
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.results-header p {
  color: #718096;
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
}

.plan-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
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
  padding: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
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
  margin-top: 2rem;
}

.restart-button {
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
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
    gap: 0.75rem;
  }

  .action-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
