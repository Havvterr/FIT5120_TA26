import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import UserDashboard from "@/components/UserDashboard.vue";
import Login from "@/components/UserLogin.vue";
import Register from "@/components/UserRegister.vue";
import Blog from "@/components/Blog.vue";
import MapboxMap from "@/components/MapboxMap.vue";
import AppointmentCalendar from "@/components/AppointmentCalendar.vue";
import CheckUV from "@/components/CheckUV.vue";
import PersonalizedAdvice from "@/components/PersonalizedAdvice.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/check-uv", // <-- Add a new route for UV checking
    name: "CheckUV",
    component: CheckUV,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/user-dashboard",
    name: "UserDashboard",
    component: UserDashboard,
    meta: { requiresAuth: true, roles: ["User"] },
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/map",
    name: "Map",
    component: MapboxMap,
  },
  {
    path: "/appointment-calendar",
    name: "AppointmentCalendar",
    component: AppointmentCalendar,
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
