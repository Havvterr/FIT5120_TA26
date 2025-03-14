<template>
  <div class="login-container">
    <!-- Image with descriptive alt text for accessibility -->
    <img
      src="@/assets/login-banner.jpg"
      alt="A person logging into the app"
      class="login-image img-fluid"
    />
    <h2>Welcome Back</h2>
    <form @submit.prevent="login">
      <!-- Email Input with label -->
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Enter your email"
          required
          aria-required="true"
        />
      </div>

      <!-- Password Input with label -->
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter your password"
          required
          aria-required="true"
        />
      </div>

      <!-- Role Selection with aria-labels for better screen reader support -->
      <div class="form-group">
        <fieldset>
          <legend>Login as:</legend>
          <div>
            <input
              type="radio"
              id="userRole"
              value="User"
              v-model="role"
              aria-checked="true"
            />
            <label for="userRole">User</label>
          </div>
          <div>
            <input
              type="radio"
              id="adminRole"
              value="Admin"
              v-model="role"
              aria-checked="false"
            />
            <label for="adminRole">Admin</label>
          </div>
        </fieldset>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase/init"; // Ensure correct Firebase import
import { signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const role = ref("User");
const router = useRouter();

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Store user info in localStorage
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        email: user.email,
        role: role.value,
      })
    );

    // Redirect based on role
    if (role.value === "Admin") {
      router.push("/admin-dashboard");
    } else {
      router.push("/user-dashboard");
    }

    alert(`Login successful as ${role.value}`);
  } catch (error) {
    console.log(error.code);
    alert("Invalid email or password");
  }
};
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.login-image {
  max-width: 100%;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
