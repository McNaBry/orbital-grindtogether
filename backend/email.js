const nodemailer = require("nodemailer")
const { db, FieldValue } = require("./firebase")

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

async function updateNotifFilters(userID, filterArr) {
  return await db
    .collection("users")
    .doc(userID)
    .update({ notifFilters: filterArr })
    .then(res => true)
    .catch(err => {
      console.log(err)
      return false
    })
}

async function getSubscribedUsers(filterArr) {
  const snapshot = await db
    .collection("users")
    .where("notifFilters", "array-contains-any", filterArr)
    .where("optInStatus", "==", true)
    .get()
  const users = []
  snapshot.forEach(doc => users.push(doc.data().email))
  return users
}

async function sendToReceivers(receiversArr, subject, text) {
  const receiverString = receiversArr.join(", ")
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

async function sendListingNotif(listingData) {
  const filterArr = [
    ...listingData.tags.modules, 
    ...listingData.tags.locations,
    ...listingData.tags.faculties
  ]
  const userEmails = await getSubscribedUsers(filterArr)
  if (userEmails.length == 0) return
  await sendToReceivers(
    userEmails, 
    "GrindTogether: New Listing Created",
    "Listing title: " + listingData.title
  )
}

module.exports = {
  updateNotifFilters,
  sendListingNotif
}