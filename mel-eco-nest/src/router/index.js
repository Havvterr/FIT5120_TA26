import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeatMapView from '../views/HeatMapView.vue'
import MitigationView from '../views/MitigationView.vue'
import PlantRecommendation from '../views/PlantRecommendation.vue'
import WaterReminderView from '../views/WaterReminderView.vue'
import PlantingGuideView from '../views/PlantingGuideView.vue'
import AIBalconyPreviewView from '../views/AIBalconyPreviewView.vue'
// Import Energy Journey related components
import EnergyProgressView from '../views/energy-journey/EnergyProgressView.vue'
import MyPlanView from '../views/energy-journey/MyPlanView.vue'
import GoalTrackerView from '../views/energy-journey/GoalTrackerView.vue'
import BuildMicroOasisView from '../views/BuildMicroOasisView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/actions',
      name: 'actions',
      component: () => import('../views/ActionsView.vue'),
      children: [
        {
          path: 'build-micro-oasis',
          name: 'buildMicroOasis',
          component: BuildMicroOasisView,
        },
        {
          path: 'plant-recommendation',
          name: 'plantRecommendation',
          component: PlantRecommendation,
        },
        {
          path: 'water-reminder',
          name: 'waterReminder',
          component: WaterReminderView,
        },
        {
          path: 'planting-guide',
          name: 'planting-guide',
          component: PlantingGuideView,
        },
        {
          path: 'ai-balcony-preview',
          name: 'aiBalconyPreview',
          component: AIBalconyPreviewView,
        },
        {
          path: 'my-plan',
          name: 'myPlan',
          component: MyPlanView,
        },
        {
          path: 'goal-tracker',
          name: 'goalTracker',
          component: GoalTrackerView,
        },
      ],
    },
    {
      path: '/explore',
      name: 'explore',
      component: () => import('../views/ExploreView.vue'),
      children: [
        {
          path: 'heat-map',
          name: 'heatMap',
          component: HeatMapView,
        },
        {
          path: 'mitigation',
          name: 'mitigation',
          component: MitigationView,
        },
        {
          path: 'energy-progress',
          name: 'energyProgress',
          component: EnergyProgressView,
        },
      ],
    },
  ],
})

export default router
