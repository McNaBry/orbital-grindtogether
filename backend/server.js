// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
// const nodemailer = require("nodemailer");
// const cookieParser = require("cookie-parser");
// const Cookies = require('universal-cookie')

const app = express()
const { db, fireAuth } = require("./firebase")
const {
  signInUser,
  createAccount,
  deleteAccount,
  sendResetLink,
  validateOob,
  validateToken,
} = require("./authentication")
const {
  getListing,
  getListings,
  createListing,
  updateListing,
  deleteListing,
  getLikedListings,
  getCreatedListings,
} = require("./listingDb")
const { firestore } = require("firebase-admin")
const { sendToReceivers } = require("./email")

const apiKey = process.env.FIREBASE_API_KEY

//app.use(cookieParser());
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // To parse form data

async function getUserByEmail(email) {
  return await fireAuth.getUserByEmail(email).catch((err) => null)
}

// API endpoint for Signing Up
app.post("/sign-up", async (req, res) => {
  const createAccountRes = createAccount(req.body)
  if (createAccountRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

// API endpoint for Signing In
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body
  /* 
    Sends a POST request with user credentials to Firebase Auth API
    If sign in is successful a 200 OK HTTP status code is returned
  */
  const signInRes = await signInUser(email, password)
  // Retrieves the ID token that Firebase Auth returns when the user is signed in
  const tokenID = signInRes.data.idToken

  if (signInRes.status == 200) {
    res.status(200).json({ tokenID: tokenID }).send()
  } else {
    res.status(400).send()
  }
})

app.post("/validate-token", async (req, res) => {
  const { tokenID } = req.body
  const users = await validateToken(tokenID)
  if (users.length == 0) {
    console.log("Null array for user UID query")
    res.status(400).send()
  } else if (users.length >= 1) {
    // If all goes well, only one user will be returned
    // If not we still return the first user in the array
    res.status(200).json(users[0]).send()
  }
})

// API Endpoint to receive email to send password reset link
app.post("/input-email-for-reset", async (req, res) => {
  const { email } = req.body
  const resetEmailRes = await sendResetLink(email)
  if (resetEmailRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

// API Endpoint to validate oob code for password reset
app.post("/validate-oob", async (req, res) => {
  const { oobCode } = req.body
  const validateOobRes = await validateOob(oobCode)
  if (validateOobRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

// API Endpoint to reset password with valid oob code
app.post("/reset-password", async (req, res) => {
  const { oobCode, newPassword } = req.body
  const resetPasswordRes = await axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
      { oobCode: oobCode, newPassword: newPassword }
    )
    .catch((err) => {
      return res.status(400)
    })

  if (resetPasswordRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.delete("/delete-account", async (req, res) => {
  const { email, password } = req.body

  // Check if details given are valid by signing in
  const signInRes = await signInUser(email, password)
  // Either email/password not valid or user is not in Firebase Auth
  if (signInRes.status != 200) {
    res.status(401).send()
  }

  // Get the user record to retrieve the UID for deletion
  const userRecord = await getUserByEmail(email)
  if (!userRecord) {
    console.log("No user record found with the email provided")
    return res.status(400).send()
  }

  // Delete user from Firebase Auth
  const deleteAccAuth = await deleteAccount(userRecord.uid)
  if (!deleteAccAuth) {
    console.log("Deletion error")
    return res.status(400).send()
  }

  // Delete user from Firestore
  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get()
    snapshot.forEach((doc) => doc.ref.delete())
    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

// middleware to extract token from cookie and verify it before use
// const verifyIdToken = async (req, res, next) => {
//   const idToken = req.cookies.idToken;

//   if (!idToken) {
//     return res.status(401).send("Unauthorised");
//   }

//   try {
//     const decodedToken = await fireAuth.verifyIdToken(idToken);
//     const userId = decodedToken.uid;
//     const email = decodedToken.email;

//     // we will attach the user object to the req object to be passed around
//     req.user = { userId, email }
//     next();
//   } catch (error) {
//     console.log('Failed to verify idToken:', error);
//     res.status(401).send('Unauthorized');
//   }
// }

// Get the data of the specific user to be displayed in the profile page
// app.get("/profile-page", verifyIdToken, async (req, res) => {
//   try {
//     const uid = req.user.userId;
//     const snapshot = await db.collection("users").doc(uid).get();

//     if (!snapshot.exists) {
//       console.log("no data found regarding particular user");
//       res.status(404).send();
//       return;
//     }

//     const userData = snapshot.data()
//     console.log("i successfully sent the data");
//     res.send(userData);
//   } catch (error) {
//     console.log("no data for you");
//     res.status(500).send();
//   }
// })

app.post("/get-profile", async (req, res) => {
  const { uid } = req.body
  if (!uid || uid == "") res.status(400).json({}).send()
  const docRef = await db.collection("users").doc(uid).get()
  if (docRef.exists) {
    const userData = docRef.data()
    res.status(200).json(userData).send()
  } else {
    res.status(400).json({}).send()
  }
})

// Update the database when the user modifies a field in the profile page
app.post("/update-profile", async (req, res) => {
  try {
    const { uid, fieldToUpdate, value } = req.body
    await db
      .collection("users")
      .doc(uid)
      .update({ [fieldToUpdate]: value })
    res.status(200).send()
  } catch (error) {
    console.log("cannot update")
    res.status(500).send()
  }
})

// Update the database when the user clicks on the switch
app.post("/update-opt-in-status", async (req, res) => {
  try {
    const { uid, optInStatus } = req.body
    console.log(optInStatus)
    await db
      .collection("users")
      .doc(uid)
      .update({ ["optInStatus"]: optInStatus })
    res.status(200).send()
  } catch (error) {
    console.log("opt in status is not updated")
    res.status(500).send()
  }
})

app.post("/sign-out", async (req, res) => {
  const { uid } = req.body
  const userRef = await db.collection("users").doc(uid).get()
  if (!userRef.exists) {
    res.status(400).send()
    return
  }
  const user = userRef.data()
  const email = user.email
  const authUser = await fireAuth.getUserByEmail(email).then((auth) => auth.uid)
  // forces users to sign out from all devices
  await fireAuth
    .revokeRefreshTokens(authUser)
    .then(() => {
      console.log("Sign out successful")
      res.status(200).send()
    })
    .catch((error) => {
      console.log("Sign out unsuccessful")
      res.status(500).send()
    })
})

// API Endpoint to create listing
app.post("/create-listing", async (req, res) => {
  const createListingRes = await createListing(req.body.userID, req.body)
  if (createListingRes) {
    // we will send an email to all users with optInStatus true
    const usersSnapshot = await db.collection("users").where("optInStatus", "==", true).get()
    const emailList = []
    usersSnapshot.forEach(doc => {
      emailList.push(doc.data().email)
    })

    sendToReceivers(emailList, "GrindTogether: New Listing Created!", )

    if (users.docs.length > 0) {
      const recipientsEmails = users.docs.map((doc) => doc.data().email)

      const promises = recipientsEmails.map((email) => {
        const emailOptions = {
          from: "tzejie.c@gmail.com",
          to: "mcnabry123@gmail.com",
          subject: "sexy new listing dropped",
          text: "Check out the new listing on GrindTogether!",
        }

        // return fireAuth.getUserByEmail(email).then(user => {
        //   emailOptions.message.uid = user.uid
        //   return firestore.collection("emailQueue").add(emailOptions)
        // })

        console.log(transporter)
        return transporter
          .sendMail(emailOptions)
          .then(() => {
            console.log(`email sent to ${email}`)
            // we just store the email we sent out for now
            return firestore.collection("emailQueue").add(emailOptions)
          })
          .catch((error) => {
            console.error(`An error occurred when sending email to ${email}`)
          })
      })

      Promise.all(promises)
        .then(() => res.status(200).send())
        .catch((error) => {
          console.error("An error occurred when sending emails")
          res.status(500).send()
        })
    } else {
      console.log("No users with optInStatus true found.")
      res.status(200).send()
    }
  } else {
    res.status(400).send()
  }
})

app.post("/get-listings", async (req, res) => {
  const results = await getListings()
  if (results.length > 0) {
    res.json(results).send()
  } else {
    res.status(400).send()
  }
})

app.delete("/delete-listing", async (req, res) => {
  const { userID, listingUID } = req.body
  const deleteListingRes = await deleteListing(userID, listingUID)
  if (deleteListingRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.post("/get-dashboard-listings", async (req, res) => {
  const { userID } = req.query
  const likedListings = getLikedListings(userID)
  const createdListings = getCreatedListings(userID)
  const results = await Promise.all([likedListings, createdListings])
  // console.log(results)
  return res.json(results).send()
})

const port = 5000

app.listen(port, () => console.log("Listening on " + port))
