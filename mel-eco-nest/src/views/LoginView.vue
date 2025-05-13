<template>
  <div class="login-container">
    <div class="login-box">
      <h1>MelEcoNest</h1>
      <div class="password-form">
        <input
          type="password"
          v-model="password"
          placeholder="Enter access password"
          @keyup.enter="verifyPassword"
        >
        <button @click="verifyPassword">Enter</button>
      </div>
      <p class="error-message" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref('')

// The password is set to 'meleco2024' here, but in a real application, a more secure method should be used
const CORRECT_PASSWORD = 'T@26econesT'

const verifyPassword = () => {
  if (password.value === CORRECT_PASSWORD) {
    localStorage.setItem('isAuthenticated', 'true')
    router.push('/')
  } else {
    error.value = 'Incorrect password, please try again'
    password.value = ''
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a712d 0%, #034c26 100%);
}

.login-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.login-box h1 {
  color: #034c26;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #1a712d;
}

button {
  padding: 1rem;
  background-color: #1a712d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #034c26;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
