const sgMail = require("@sendgrid/mail");

// Set your SendGrid API Key
sgMail.setApiKey(
  "SG.Fs1rxz0rR96gwrsMNelryg.O19sfX0GcUGYs-yPGnm1gjMHEI9I0iiHwbtUPeQfGA"
);

// Function to send email
const sendEmail = async (recipientEmail, subject, bodyText, bodyHtml) => {
  const msg = {
    to: "rutvikagupta14@gmail.com", // Recipient email
    from: "rutvigupta1@gmail.com", // Replace with your verified personal email
    subject: subject, // Use the passed subject variable
    text: bodyText, // Use the passed bodyText variable
    html: bodyHtml, // Use the passed bodyHtml variable
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.body : error
    );
  }
};

// Export the sendEmail function for use in other parts of the app
module.exports = sendEmail;
