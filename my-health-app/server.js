const express = require("express");
const cors = require("cors"); // Import cors

// Import the sendBulkEmail function from the appropriate module
const { sendBulkEmail } = require("./path_to_bulkEmailService"); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Middleware to parse JSON bodies

// Bulk email API route
app.post("/api/send-bulk-email", async (req, res) => {
  const { recipients, subject, bodyText, bodyHtml } = req.body;

  if (!recipients || recipients.length === 0) {
    return res.status(400).json({ error: "No recipients provided" });
  }

  try {
    // Call the sendBulkEmail function
    await sendBulkEmail(recipients, subject, bodyText, bodyHtml);
    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error in API endpoint:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
