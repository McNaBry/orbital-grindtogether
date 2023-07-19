// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const multer = require("multer")
// const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser")

const { db, fireAuth, storage, bucket } = require("./firebase")
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
  likeListing,
  getLikedListings,
  getCreatedListings,
  getListingLikers,
} = require("./listingDb")
const {
  getFullProfile,
  getViewProfile,
  updateProfile,
  setProfilePic
} = require('./profile')
const { 
  updateNotifFilters,
  sendListingNotif,
} = require("./email")
const { verifyAuthCookie } = require("./authMiddleware")

const apiKey = process.env.FIREBASE_API_KEY

const app = express()
app.use(cookieParser())
// Allow for cross-origin request since our backend and frontend are hosted on different domains(origins)
// By specifying the origin, this allows us to transmit credentials via cookies in our requests
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
const upload = multer({ storage: multer.memoryStorage() }) // Handling file transfers
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // To parse form data

async function getUserByEmail(email) {
  return await fireAuth.getUserByEmail(email).catch((err) => null)
}

function isValidUID(uid) {
  // return !(
  //   (uid == undefined) || (uid == "")
  // )
  if ((uid == undefined) || (uid == "")) {
    console.log("invalid token")
    return false
  }
  return true
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

  if (signInRes != undefined && signInRes.status == 200) {
    // Retrieve the id token that Firebase Auth returns
    const idToken = signInRes.data.idToken

    // Use the idToken to create a session cookie that will persist user sign-in for a week
    const seshCookie = await fireAuth.createSessionCookie(idToken, { expiresIn: 60 * 60 * 24 * 7 * 1000 })
    
    // Retrieve user's Firestore UID and full name
    const users = await validateToken(idToken)
    if (users.length == 0) {
      console.log("Null array for user UID query")
      res.status(400).send()
    } else {
      // Set httpOnly cookies on the frontend browser
      res
      .cookie("authCookie", seshCookie, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
      .cookie("uid", users[0].uid, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
      res.status(200).json(users[0]).send()
    }
  } else {
    res.status(400).send()
  }
})

// app.post("/validate-token", async (req, res) => {
//   const authToken = req.cookies.jwt
//   if (authToken == undefined) {
//     res.status(400).send()
//     return
//   }
//   const users = await validateToken(authToken)
//   if (users.length == 0) {
//     console.log("Null array for user UID query")
//     res.status(400).send()
//   } else if (users.length >= 1) {
//     // If all goes well, only one user will be returned
//     // If not we still return the first user in the array
//     res.status(200).json(users[0]).send()
//   }
// })

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

app.delete("/delete-account", verifyAuthCookie, async (req, res) => {
  const { email, password } = req.body

  // Check if details given are valid by signing in
  const signInRes = await signInUser(email, password)
  // Either email/password not valid or user is not in Firebase Auth
  if (signInRes.status != 200) {
    res.status(401).send()
  }

  // Get the user record to retrieve the UID for deletion
  console.log(email)
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

app.post("/get-profile", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).json({}).send()
    return
  }
  const userData = await getFullProfile(uid)
  userData == null 
    ? res.status(400).json({}).send()
    : res.json(userData).send()
})

app.post("/view-profile", async (req, res) => {
  const { uid } = req.body
  const userData = await getViewProfile(uid)
  userData == null 
    ? res.status(400).json({}).send()
    : res.json(userData).send()
}) 

// Update the database when the user modifies a field in the profile page
app.post("/update-profile", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  const { fieldToUpdate, value } = req.body
  const updateRes = await updateProfile(uid, fieldToUpdate, value)
  updateRes
    ? res.status(200).send()
    : res.status(400).send()
})

app.post("/update-notif-filters", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return 
  }

  const filters = req.body.filters
  const updateFilterRes = await updateNotifFilters(uid, filters)
  if (updateFilterRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.post("/upload-profile-pic", upload.single('profilePic'), async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return 
  }

  const setProfilePicRes = setProfilePic(uid, req.file)
  setProfilePicRes
    ? res.status(200).json({ message: "upload success" }).send()
    : res.status(400).json({ error: "upload error" }).send()
})

app.post("/sign-out", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
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
app.post("/create-listing", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  const createListingRes = await createListing(uid, req.body)
  if (createListingRes) {
    // Send OK status to the user who created the listing
    // Whether the notification succeeds does not matter to the creator
    res.status(200).send()

    try {
      // We will send an email to all users with optInStatus true
      // And filter for those interested in the listing's tag
      await sendListingNotif(req.body)
    } catch (error) {
      console.log(error)
    }
    
  } else {
    res.status(400).send()
  }
})

app.post("/edit-listing", async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  const editListingRes = await updateListing(uid, req.body.id, req.body)
  if (editListingRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.post("/get-listings", async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID) {
    res.status(400).send()
    return
  }
  const results = await getListings(uid)
  if (results.length > 0) {
    res.json(results).send()
  } else {
    res.status(400).send()
  }
})

app.delete("/delete-listing", verifyAuthCookie, async (req, res) => {
  const { listingUID } = req.body
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  const deleteListingRes = await deleteListing(uid, listingUID)
  if (deleteListingRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.post("/get-dashboard-listings", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    console.log(uid)
    res.status(400).send()
    return
  }
  const likedListings = getLikedListings(uid)
  const createdListings = getCreatedListings(uid)
  const results = await Promise.all([likedListings, createdListings])
  // console.log(results)
  return res.json(results).send()
})

app.post("/get-interested-users", async (req, res) => {
  const { listingUID } = req.body
  
  try {
    const users = await getListingLikers(listingUID);
    res.status(200).json(users)
  } catch (error) {
    console.error("error getting likers list", error)
    res.status(500).send()
  }
})

app.post("/like-listing", verifyAuthCookie, async (req, res) => {
  const { listingUID, action } = req.body
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  } 
  if (action != "like" && action != "unlike") {
    res.status(500).json({ error: "Invalid action" }).send()
  }
  const likeListingRes = await likeListing(uid, listingUID, action)
  if (likeListingRes) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

const port = 5000

app.listen(port, () => console.log("Listening on " + port))
