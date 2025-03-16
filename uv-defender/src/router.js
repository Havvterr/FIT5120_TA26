import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CheckUV from "@/views/CheckUV.vue";
import UVLevels from "@/views/UVLevels.vue";
import UVImpactInfo from "@/views/UVImpactInfo.vue";
import PersonalizedAdvice from "@/views/PersonalizedAdvice.vue";
import SunscreenReminders from "@/views/SunscreenReminders.vue";
import SunSafeProducts from "@/views/SunSafeProducts.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/check-uv",
    name: "CheckUV",
    component: CheckUV,
  },
  {
    path: "/uv-levels",
    name: "UVLevels",
    component: UVLevels,
  },
  {
    path: "/uv-impact-info",
    name: "UVImpactInfo",
    component: UVImpactInfo,
  },
  {
    path: "/personalized-advice",
    name: "PersonalizedAdvice",
    component: PersonalizedAdvice,
  },
  {
    path: "/sunscreen-reminders",
    name: "SunscreenReminders",
    component: SunscreenReminders,
  },
  {
    path: "/sun-safe-products",
    name: "SunSafeProducts",
    component: SunSafeProducts,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
