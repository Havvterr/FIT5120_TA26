import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/heat-map',
      name: 'heat-map',
      component: HeatMapView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mitigation',
      name: 'mitigation',
      component: MitigationView,
      meta: { requiresAuth: true }
    },
    {
      path: '/plant-recommendation',
      name: 'plantRecommendation',
      component: PlantRecommendation,
      meta: { requiresAuth: true }
    },
    {
      path: '/water-reminder',
      name: 'waterReminder',
      component: WaterReminderView,
      meta: { requiresAuth: true }
    },
    {
      path: '/planting-guide',
      name: 'planting-guide',
      component: PlantingGuideView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ai-balcony-preview',
      name: 'aiBalconyPreview',
      component: AIBalconyPreviewView,
      meta: { requiresAuth: true }
    },
    {
      path: '/energy-progress',
      name: 'energyProgress',
      component: EnergyProgressView,
      meta: { requiresAuth: true }
    },
    {
      path: '/energy-plan',
      name: 'myPlan',
      component: MyPlanView,
      meta: { requiresAuth: true }
    },
    {
      path: '/energy-goals',
      name: 'goalTracker',
      component: GoalTrackerView,
      meta: { requiresAuth: true }
    }
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  // 如果需要认证且未认证，重定向到登录页
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // 如果已认证且试图访问登录页，重定向到首页
  else if (isAuthenticated && to.path === '/login') {
    next('/')
  }
  // 其他情况正常导航
  else {
    next()
  }
})

export default router
