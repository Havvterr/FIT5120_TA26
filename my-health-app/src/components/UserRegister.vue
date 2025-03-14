<template>
  <div class="register-container">
    <img
      src="@/assets/register-banner.jpg"
      alt="Register Image"
      class="register-image img-fluid"
    />
    <h2>Create an Account</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="form-control"
          placeholder="Enter your name"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Enter your email"
          @input="validateEmail"
          required
        />
        <div v-if="emailError" class="error">{{ emailError }}</div>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter your password"
          @input="validatePassword"
          required
        />
        <div v-if="passwordError" class="error">{{ passwordError }}</div>
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          v-model="confirmPassword"
          class="form-control"
          placeholder="Confirm your password"
          @input="validateConfirmPassword"
          required
        />
        <div v-if="confirmPasswordError" class="error">
          {{ confirmPasswordError }}
        </div>
      </div>
      <div class="form-group">
        <label for="role">Register as:</label>
        <div>
          <input type="radio" id="userRole" value="User" v-model="role" /> User
          <input type="radio" id="adminRole" value="Admin" v-model="role" />
          Admin
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
import { auth } from "@/firebase/init";
import { createUserWithEmailAndPassword } from "firebase/auth";
import DOMPurify from "dompurify";

export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "User", // Default role
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
    };
  },
  methods: {
    sanitizeInput(input) {
      return DOMPurify.sanitize(input);
    },
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "Please enter a valid email address.";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      const hasUpperCase = /[A-Z]/.test(this.password);
      const hasSpecialChar = /[!@#$%^&*]/.test(this.password);
      const isLongEnough = this.password.length > 8;

      if (!isLongEnough) {
        this.passwordError = "Password must be longer than 8 characters.";
      } else if (!hasUpperCase) {
        this.passwordError =
          "Password must contain at least one uppercase letter.";
      } else if (!hasSpecialChar) {
        this.passwordError =
          "Password must contain at least one special character.";
      } else {
        this.passwordError = "";
      }
    },
    validateConfirmPassword() {
      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "Passwords do not match.";
      } else {
        this.confirmPasswordError = "";
      }
    },
    async register() {
      this.name = this.sanitizeInput(this.name);
      this.email = this.sanitizeInput(this.email);
      this.password = this.sanitizeInput(this.password);
      this.confirmPassword = this.sanitizeInput(this.confirmPassword);

      this.validateEmail();
      this.validatePassword();
      this.validateConfirmPassword();

      if (
        !this.emailError &&
        !this.passwordError &&
        !this.confirmPasswordError
      ) {
        // Check if the user is trying to register as admin but the email isn't admin@gmail.com
        if (this.role === "Admin" && this.email !== "admin@gmail.com") {
          alert("Only authorized emails can register as admin.");
          this.role = "User"; // Force role to user
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            this.email,
            this.password
          );

          console.log(userCredential);

          // Store registered user information in localStorage
          const users = JSON.parse(localStorage.getItem("users")) || [];
          users.push({
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
          });
          localStorage.setItem("users", JSON.stringify(users));

          this.$router.push("/login"); // Redirect to login page after registration
        } catch (error) {
          console.error("Registration Error:", error.message);
        }
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.register-image {
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

.error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
