<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Mel Eco Nest</h1>
      <div class="login-form">
        <div class="form-group">
          <label for="password">Please enter the password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            @keyup.enter="handleLogin"
            placeholder="Please enter the password"
          />
        </div>
        <button @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? 'Verifying...' : 'Login' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!password.value) {
    error.value = 'Please enter the password'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    // Simple password verification, should use more secure methods in production
    if (password.value === 'TA26') {
      // Login successful, store authentication state
      localStorage.setItem('isAuthenticated', 'true')
      // Redirect to home page
      router.push('/')
    } else {
      error.value = 'Incorrect password'
    }
  } catch (error) {
    error.value = 'Login failed, please try again'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #014421 0%, #2ecc71 100%);
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-box h1 {
  color: #014421;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

label {
  color: #333;
  font-weight: 500;
}

input {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #2ecc71;
}

button {
  background: #014421;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background: #2ecc71;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin: 0;
  font-size: 0.9rem;
}
</style>
