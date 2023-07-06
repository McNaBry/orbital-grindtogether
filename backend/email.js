const nodemailer = require("nodemailer")

// Create a transporter using SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
})

// Checks only if connection is successful
// Does not check if the email domain allows us to send an email
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP server is ready to take our messages");
  }
});

async function test() {
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "mcnabry123@gmail.com, tzejie.c@gmail.com", // list of receivers
    subject: "Hello SIR", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

async function sendToReceivers(receiversArr, subject, text) {
  const receiverString = receiversArr.join(", ")
  console.log(receiverString)
  try {
    const info = await transporter.sendMail({
      from: 'GrindTogether', // sender address
      to: receiverString,    // list of receivers
      subject: subject,      // Subject line
      html: `<b>${text}</b>` // html body
    })

    console.log("Message sent: %s", info.messageId)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  sendToReceivers
}