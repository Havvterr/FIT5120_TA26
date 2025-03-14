<template>
  <div>
    <h3>Send Bulk Email</h3>
    <form @submit.prevent="sendEmails">
      <!-- Recipients field -->
      <label for="recipients">Recipient Emails (comma-separated):</label>
      <input
        type="text"
        v-model="recipients"
        placeholder="Enter email addresses"
        required
      />

      <!-- Subject field -->
      <label for="subject">Subject:</label>
      <input
        type="text"
        v-model="subject"
        placeholder="Enter email subject"
        required
      />

      <!-- Message field -->
      <label for="message">Message:</label>
      <textarea
        v-model="message"
        placeholder="Enter email content"
        required
      ></textarea>

      <button type="submit">Send Bulk Email</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipients: "", // Comma-separated list of recipients
      subject: "",
      message: "",
    };
  },
  methods: {
    async sendEmails() {
      const recipientEmails = this.recipients
        .split(",")
        .map((email) => email.trim());
      const emailData = {
        recipients: recipientEmails,
        subject: this.subject,
        bodyText: this.message,
        bodyHtml: `<p>${this.message}</p>`, // Optional HTML version
      };

      try {
        const response = await fetch("/api/send-bulk-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emailData),
        });

        if (response.ok) {
          alert("Emails sent successfully");
        } else {
          alert("Failed to send emails");
        }
      } catch (error) {
        console.error("Error sending emails:", error);
      }
    },
  },
};
</script>
