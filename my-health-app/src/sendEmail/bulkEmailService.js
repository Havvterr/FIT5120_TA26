const fetch = require("node-fetch");

const sendBulkEmail = async (campaignName, subject, fromEmail, recipients) => {
  try {
    const apiKey = process.env.BREVO_API_KEY; // Ensure this matches your .env variable

    const response = await fetch("https://api.brevo.com/v3/emailCampaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        name: campaignName,
        subject: subject,
        sender: {
          name: "Your Name",
          email: fromEmail,
        },
        type: "classic",
        htmlContent: "<p>Here is your bulk email content</p>", // Replace with your desired HTML content
        recipients: {
          listIds: recipients, // List of IDs or array of email addresses
        },
        scheduledAt: new Date().toISOString(), // Set to immediate sending
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Campaign created successfully!", data);
    } else {
      console.error("Error creating campaign:", data);
    }
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};

module.exports = sendBulkEmail;
