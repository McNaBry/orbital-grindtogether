const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",
        pass: ""
    }
})

// async function sendEmail(to, subject, htmlContent) {
//   try {
//     // Create a transporter using SMTP settings
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "",
//         pass: "",
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     // Create the email message
//     const message = {
//       from: process.env.SMTP_FROM_EMAIL,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     // Send the email
//     const info = await transporter.sendMail(message);
//     console.log("Email sent:", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// }

module.exports = transporter