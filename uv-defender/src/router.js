import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import CheckUV from "@/views/CheckUV.vue";
import PersonalizedAdvice from "@/views/PersonalizedAdvice.vue";

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
    path: "/personalized-advice",
    name: "PersonalizedAdvice",
    component: PersonalizedAdvice,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
