import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HeatMapView from '../views/HeatMapView.vue'
import MitigationView from '../views/MitigationView.vue'
import PlantRecommendation from '../views/PlantRecommendation.vue'
import WaterReminderView from '../views/WaterReminderView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/heat-map',
      name: 'heatMap',
      component: HeatMapView,
      meta: { requiresAuth: true },
    },
    {
      path: '/mitigation',
      name: 'mitigation',
      component: MitigationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/plant-recommendation',
      name: 'plantRecommendation',
      component: PlantRecommendation,
      meta: { requiresAuth: true },
    },
    {
      path: '/water-reminder',
      name: 'waterReminder',
      component: WaterReminderView,
      meta: { requiresAuth: true },
    },
  ],
})

// Route guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // If authentication is required but user is not logged in, redirect to login page
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // If user is already logged in and tries to access login page, redirect to home
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
