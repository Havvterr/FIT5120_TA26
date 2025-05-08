import './assets/styles/global.css'
import './assets/styles/pages.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@lottiefiles/lottie-player'

import App from './App.vue'
import router from './router'

// Clean up any authentication state from previous versions
if (localStorage.getItem('isAuthenticated')) {
  localStorage.removeItem('isAuthenticated')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
