<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Please enter password</h2>
      <input
        type="password"
        v-model="password"
        @keyup.enter="checkPassword"
        placeholder="Please enter password"
      />
      <button @click="checkPassword">Confirm</button>
      <p v-if="error" class="error">wrong password</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LoginView',
  meta: {
    hideNavbar: true,
  },
})

const password = ref('')
const error = ref(false)
const router = useRouter()

const checkPassword = () => {
  if (password.value === 'T@26econesT') {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/')
  } else {
    error.value = true
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #45a049;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
