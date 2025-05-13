<template>
  <div class="goal-tracker">
    <h1 class="page-title" data-aos="fade-down">Energy Goal Tracker</h1>

    <div class="goal-summary" data-aos="fade-up" data-aos-delay="200">
      <div class="summary-card">
        <h2>Your Energy Saving Goals</h2>
        <p>
          Setting measurable goals is a key step toward reducing your carbon footprint and achieving
          energy efficiency.
        </p>
        <div class="goal-progress-container">
          <div class="circular-progress" data-aos="zoom-in" data-aos-delay="300">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path
                class="circle-bg"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                :stroke-dasharray="`${completionPercentage}, 100`"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="18.5" class="percentage">{{ completionPercentage }}%</text>
              <text x="18" y="23.5" class="percentage-label">Complete</text>
            </svg>
          </div>
          <div class="goals-overview">
            <div class="goal-stat" data-aos="fade-left" data-aos-delay="400">
              <div class="stat-label">Total Goals</div>
              <div class="stat-value">{{ trackedGoals.length }}</div>
            </div>
            <div class="goal-stat completed" data-aos="fade-left" data-aos-delay="500">
              <div class="stat-label">Completed</div>
              <div class="stat-value">{{ completedGoalsCount }}</div>
            </div>
            <div class="goal-stat in-progress" data-aos="fade-left" data-aos-delay="600">
              <div class="stat-label">In Progress</div>
              <div class="stat-value">{{ trackedGoals.length - completedGoalsCount }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="goals-list" data-aos="fade-up" data-aos-delay="300">
      <h2>Your Current Goals</h2>
      <div class="goal-items">
        <template v-if="trackedGoals.length > 0">
          <div
            v-for="goal in trackedGoals"
            :key="goal.id"
            class="goal-item"
            :class="{
              completed: goal.isCompleted,
              'in-progress': !goal.isCompleted,
              'custom-goal': goal.isCustom,
            }"
          >
            <div class="goal-status">
              <i :class="goal.isCompleted ? 'fas fa-check-circle' : 'fas fa-spinner'"></i>
            </div>
            <div class="goal-content">
              <h3>{{ goal.title }}</h3>
              <div class="goal-details">
                <p class="goal-description">{{ goal.description }}</p>
                <div class="goal-meta">
                  <span class="goal-date">
                    <i :class="goal.isCompleted ? 'fas fa-calendar-check' : 'fas fa-calendar'"></i>
                    {{ goal.isCompleted ? 'Achieved: ' : 'Added: ' }} {{ goal.date }}
                  </span>
                  <span v-if="!goal.isCustom && goal.savings" class="goal-impact">
                    <i class="fas fa-leaf"></i> {{ goal.savings }}
                  </span>
                  <span v-if="!goal.isCustom && getPlanTarget(goal)" class="goal-target">
                    <i class="fas fa-bullseye"></i> Target: {{ getPlanTarget(goal) }}
                  </span>
                </div>
                <div class="goal-actions">
                  <button
                    v-if="!goal.isCompleted"
                    class="complete-button"
                    @click="markAsCompleted(goal.id)"
                  >
                    Mark as Completed
                  </button>
                  <button class="untrack-button" @click="untrackGoal(goal.id)">Untrack Goal</button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="no-goals-message">
          <p>
            You haven't added any goals to track yet. Visit the Energy Plan page to add goals or
            create a custom goal below.
          </p>
        </div>
      </div>
    </div>

    <div class="add-goal-section" data-aos="fade-up" data-aos-delay="600">
      <h2>Create a Custom Goal</h2>
      <div class="add-goal-card" data-aos="zoom-in" data-aos-delay="700">
        <div class="add-goal-icon">
          <i class="fas fa-caret-down"></i>
        </div>
        <h3>Add a New Energy Saving Goal</h3>

        <form @submit.prevent="addCustomGoal" class="custom-goal-form">
          <div class="form-group">
            <label for="goalTitle">Goal Title</label>
            <input
              type="text"
              id="goalTitle"
              v-model="customGoal.title"
              placeholder="e.g., Reduce hot water usage"
              required
            />
          </div>

          <div class="form-group">
            <label for="goalDescription">Description</label>
            <textarea
              id="goalDescription"
              v-model="customGoal.description"
              placeholder="Describe your energy saving goal..."
              rows="3"
              required
            ></textarea>
          </div>

          <button type="submit" class="add-goal-btn">Create Custom Goal</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Load tracked goals
const trackedGoals = ref([])

// Custom goal form
const customGoal = ref({
  title: '',
  description: '',
})

// Storage key - Using a fixed key name
const STORAGE_KEY = 'energy_tracker_goals'

// Calculate the number of completed goals
const completedGoalsCount = computed(() => {
  return trackedGoals.value.filter((goal) => goal.isCompleted).length
})

// Calculate completion percentage
const completionPercentage = computed(() => {
  if (trackedGoals.value.length === 0) return 0
  return Math.round((completedGoalsCount.value / trackedGoals.value.length) * 100)
})

// Save data to localStorage
const saveGoals = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedGoals.value))
  } catch (e) {
    console.error('Unable to save goal data:', e)
  }
}

// Load data from localStorage
const loadGoals = () => {
  try {
    const savedGoals = localStorage.getItem(STORAGE_KEY)
    if (savedGoals) {
      trackedGoals.value = JSON.parse(savedGoals)
      console.log('Successfully loaded', trackedGoals.value.length, 'goals')
    } else {
      console.log('No saved goal data found')
    }
  } catch (e) {
    console.error('Error loading goal data:', e)
  }
}

// Mark a goal as completed
const markAsCompleted = (goalId) => {
  const goalIndex = trackedGoals.value.findIndex((goal) => goal.id === goalId)
  if (goalIndex !== -1) {
    trackedGoals.value[goalIndex].isCompleted = true
    trackedGoals.value[goalIndex].date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })

    // Save changes
    saveGoals()

    // Force view refresh
    nextTick(() => {
      // Refresh AOS after DOM update (without affecting cards with AOS removed)
      AOS.refresh()
    })
  }
}

// Untrack a goal
const untrackGoal = (goalId) => {
  const goalIndex = trackedGoals.value.findIndex((goal) => goal.id === goalId)
  if (goalIndex !== -1) {
    trackedGoals.value.splice(goalIndex, 1)

    // Save changes
    saveGoals()

    // Force view refresh
    nextTick(() => {
      // Refresh AOS after DOM update (without affecting cards with AOS removed)
      AOS.refresh()
    })
  }
}

// Add custom goal
const addCustomGoal = () => {
  // Create unique ID for custom goal
  const customId = 'custom-' + Date.now()

  const newGoal = {
    id: customId,
    title: customGoal.value.title,
    description: customGoal.value.description,
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    isCompleted: false,
    isCustom: true, // Mark as custom goal
  }

  trackedGoals.value.push(newGoal)

  // Save changes
  saveGoals()

  // Reset form
  customGoal.value = {
    title: '',
    description: '',
  }
}

// Get target based on plan type
const getPlanTarget = (plan) => {
  // Skip target display for custom goals
  if (plan.isCustom) {
    return null
  }

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

// Sync with MyPlanView.vue tracked data on component mount
const syncWithMyPlanData = () => {
  try {
    // Read tracked data from MyPlanView
    const planViewData = localStorage.getItem('trackedGoals')

    if (planViewData) {
      const planGoals = JSON.parse(planViewData)

      // If we have no data but MyPlanView has data, use MyPlanView's data
      if (trackedGoals.value.length === 0 && planGoals.length > 0) {
        trackedGoals.value = planGoals
        saveGoals() // Save to our new key
        console.log('Synced', planGoals.length, 'goals from MyPlanView')
      }
      // If both have data, ensure data consistency
      else if (trackedGoals.value.length > 0 && planGoals.length > 0) {
        // First keep our data, then save it to MyPlanView's key
        localStorage.setItem('trackedGoals', JSON.stringify(trackedGoals.value))
        console.log('Synced tracking data to MyPlanView')
      }
    }
  } catch (e) {
    console.error('Error syncing data:', e)
  }
}

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true, // Set to true, animation plays only once
  })

  // Load saved goal data
  loadGoals()

  // Sync with MyPlanView data
  syncWithMyPlanData()
})
</script>

<style scoped>
.goal-tracker {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: #1a2a3a;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.goal-summary {
  margin-bottom: 3rem;
}

.summary-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.summary-card h2 {
  color: #1e6a93;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.summary-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.goal-progress-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.circular-progress {
  width: 180px;
  height: 180px;
}

.circular-chart {
  display: block;
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #edf2f7;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #1e6a93;
  stroke-width: 3.8;
  stroke-linecap: round;
}

.percentage {
  fill: #1e6a93;
  font-size: 0.5em;
  text-anchor: middle;
  font-weight: bold;
}

.percentage-label {
  fill: #718096;
  font-size: 0.3em;
  text-anchor: middle;
}

.goals-overview {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.goal-stat {
  background: #f4f6f8;
  border-radius: 8px;
  padding: 1.2rem;
  min-width: 120px;
  flex: 1;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #1a2a3a;
  font-size: 2rem;
  font-weight: bold;
}

.goal-stat.completed .stat-value {
  color: #10b981;
}

.goal-stat.in-progress .stat-value {
  color: #f59e0b;
}

.goals-list {
  margin-bottom: 3rem;
}

.goals-list h2 {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.goal-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  gap: 1.5rem;
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

.completed .goal-status i {
  color: #10b981;
}

.in-progress .goal-status i {
  color: #f59e0b;
}

.goal-content {
  flex: 1;
}

.goal-content h3 {
  margin: 0 0 1rem 0;
  color: #1e6a93;
  font-size: 1.4rem;
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #edf2f7;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1e6a93;
  border-radius: 5px;
}

.completed .progress-fill {
  background: #10b981;
}

.in-progress .progress-fill {
  background: #f59e0b;
}

.progress-text {
  color: #718096;
  font-size: 0.9rem;
  min-width: 90px;
}

.goal-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.goal-date,
.goal-impact {
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.add-goal-section {
  margin-bottom: 2rem;
}

.add-goal-section h2 {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.add-goal-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.add-goal-card:hover {
  transform: translateY(-5px);
}

.add-goal-icon {
  font-size: 3rem;
  color: #1e6a93;
  margin-bottom: 1rem;
}

.add-goal-card h3 {
  color: #1e6a93;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.add-goal-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.add-goal-btn {
  background-color: #1e6a93;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-goal-btn:hover {
  background-color: #179d24;
}

@media (max-width: 768px) {
  .goal-progress-container {
    flex-direction: column;
    align-items: center;
  }

  .goals-overview {
    width: 100%;
  }

  .goal-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .goal-item {
    flex-direction: column;
    gap: 1rem;
  }

  .goal-status {
    justify-content: center;
  }
}

.goal-description {
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.goal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.complete-button {
  background: #1e6a93;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.complete-button:hover {
  background: #165a7d;
}

.untrack-button {
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.untrack-button:hover {
  background: #c53030;
}

.custom-goal-form {
  width: 100%;
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #1e6a93;
  outline: none;
}

.no-goals-message {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  color: #718096;
}

.custom-goal {
  border-left: 4px solid #805ad5;
}

.custom-goal .goal-status i {
  color: #805ad5;
}
</style>
