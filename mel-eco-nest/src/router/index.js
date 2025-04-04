import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeatMapView from '../views/HeatMapView.vue'
import MitigationView from '../views/MitigationView.vue'
import PlantRecommendation from '../views/PlantRecommendation.vue'

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/plant-recommendation',
      name: 'plantRecommendation',
      component: PlantRecommendation,
    },
  ],
})

export default router
