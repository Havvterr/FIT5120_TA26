import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeatMapView from '../views/HeatMapView.vue'
import MitigationView from '../views/MitigationView.vue'
import PlantRecommendation from '../views/PlantRecommendation.vue'
import WaterReminderView from '../views/WaterReminderView.vue'
import PlantingGuideView from '../views/PlantingGuideView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/heat-map',
      name: 'heatMap',
      component: HeatMapView,
    },
    {
      path: '/mitigation',
      name: 'mitigation',
      component: MitigationView,
    },
    {
      path: '/plant-recommendation',
      name: 'plantRecommendation',
      component: PlantRecommendation,
    },
    {
      path: '/water-reminder',
      name: 'waterReminder',
      component: WaterReminderView,
    },
    {
      path: '/planting-guide',
      name: 'planting-guide',
      component: PlantingGuideView,
    },
  ],
})

export default router
