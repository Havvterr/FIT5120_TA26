<template>
  <div class="user-dashboard">
    <h1>User Dashboard</h1>
    <p>Welcome to your dashboard, {{ user.name }}.</p>

    <!-- Include the Rating component -->
    <Rating />

    <!-- Button to send a test email -->
    <div class="email-section">
      <h3>Send a Test Email</h3>
      <button @click="sendTestEmail" class="btn btn-primary">
        Send Test Email
      </button>
    </div>

    <!-- Other content -->
  </div>
</template>

<script>
import Rating from "@/components/Rating.vue"; // Adjust the path as necessary
import axios from "axios"; // Import Axios for making HTTP requests

export default {
  components: {
    Rating,
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("loggedInUser")) || {},
    };
  },
  methods: {
    async sendTestEmail() {
      const emailData = {
        recipientEmail: "rutvikagupta14@gmail.com", // Replace with recipient's email
        subject: "Test Email from User Dashboard",
        bodyText: `Hello, this is a test email sent by ${this.user.name}.`,
        bodyHtml: `<strong>Hello, this is a test email sent by ${this.user.name}.</strong>`,
      };

      try {
        // Assuming you are using the backend server to handle the email
        await axios.post("http://localhost:3000/send-email", emailData);
        alert("Email sent successfully!");
      } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send email");
      }
    },
  },
};
</script>

<style scoped>
.user-dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.email-section {
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
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
