// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const axios = require("axios")
const multer = require("multer")
const cookieParser = require("cookie-parser")

const { db, fireAuth, FieldValue } = require("./firebase")
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
  countListings,
} = require("./listingDb")
const { updateNotifFilters, sendListingNotif } = require("./email")
const {
  getFullProfile,
  getViewProfile,
  updateProfile,
  setProfilePic,
} = require("./profile")
const { verifyAuthCookie } = require("./authMiddleware")

const apiKey = process.env.FIREBASE_API_KEY

const app = express()
app.use(cookieParser())
// Allow for cross-origin request since our backend and frontend are hosted on different domains(origins)
// By specifying the origin, this allows us to transmit credentials via cookies in our requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)
const upload = multer({ storage: multer.memoryStorage() }) // Handling file transfers
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // To parse form data

async function getUserByEmail(email) {
  return await fireAuth.getUserByEmail(email).catch((err) => null)
}

function isValidUID(uid) {
  if (uid == undefined || uid == "") {
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
    const seshCookie = await fireAuth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000,
    })

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

app.post("/sign-out", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  try {
    res
      .clearCookie("authCookie", {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
      .clearCookie("uid", {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
      res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
})

app.post("/validate-token", verifyAuthCookie, async (req, res) => {
  // Session validation is already done by verifyAuthCookie
  // So, next layer is just to verify the UID cookie exists
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  return res.status(200).send()
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

app.delete("/delete-account", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  const { email, password } = req.body

  try {
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
    await db
      .collection("users")
      .doc(uid)
      .delete()
    res
      .clearCookie("authCookie", {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
      .clearCookie("uid", {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "none" : "lax",
      })
    res.status(200).send()

    // Scrub every listing the user has created
    const createdSnapshot = await db
      .collection("listings")
      .where("createdBy", "==", uid)
      .get()
    createdSnapshot
      .forEach(doc => {
        db.collection("listings").doc(doc.id).delete()
      })

    // Scrub every listing the user has liked
    const likedSnapshot = await db
      .collection("listings")
      .where("likes", "array-contains", uid)
      .get()
    likedSnapshot
      .forEach(doc => {
        db.collection("listings").doc(doc.id)
          .update({
            likes: FieldValue.arrayRemove(uid),
            interest: FieldValue.increment(-1),
          })
      })

    console.log("Successfully scrubbed user's created and liked listings")

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
  userData == null ? res.status(400).json({}).send() : res.json(userData).send()
})

app.post("/view-profile", async (req, res) => {
  const { uid } = req.body
  const userData = await getViewProfile(uid)
  userData == null ? res.status(400).json({}).send() : res.json(userData).send()
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
  updateRes ? res.status(200).send() : res.status(400).send()
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

app.post("/upload-profile-pic", upload.single("profilePic"), async (req, res) => {
    const uid = req.cookies.uid
    if (!isValidUID(uid)) {
      res.status(400).send()
      return
    }

    const setProfilePicRes = setProfilePic(uid, req.file)
    setProfilePicRes
      ? res.status(200).json({ message: "upload success" }).send()
      : res.status(400).json({ error: "upload error" }).send()
  }
)

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

app.post("/edit-listing", verifyAuthCookie, async (req, res) => {
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
    const users = await getListingLikers(listingUID)
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

app.post("/report-user", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }
  try {
    const reportData = req.body
    reportData.reporter = uid
    await db.collection("user-reports").add({ reportData })
    res.status(200).send()
  } catch (error) {
    res.status(500).send()
  }
})

app.post("/get-rating", async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }

  const { listingID } = req.body
  if (listingID == "" || listingID == undefined) {
    res.status(400).send()
    return
  }

  const ratingSnapshot = await db
    .collection("ratings")
    .where("userID", "==", uid)
    .where("listingID", "==", listingID)
    .get()

  if (ratingSnapshot.empty) {
    res
      .status(200)
      .json({
        friendly: 0,
        helpful: 0,
        recommend: 0,
      })
      .send()
    return
  }

  const ratingData = []
  ratingSnapshot.forEach((ratingDoc) => ratingData.push(ratingDoc.data()))
  res
    .status(200)
    .json({
      friendly: ratingData[0].friendly,
      helpful: ratingData[0].helpful,
      recommend: ratingData[0].recommend,
    })
    .send()
})

app.post("/update-rating", verifyAuthCookie, async (req, res) => {
  const uid = req.cookies.uid
  if (!isValidUID(uid)) {
    res.status(400).send()
    return
  }

  const rating = {
    userID: uid,
    creatorID: req.body.creatorID,
    listingID: req.body.listingID,
    friendly: req.body.friendly,
    helpful: req.body.helpful,
    recommend: req.body.recommend,
    overall: req.body.overall,
  }

  if (rating.userID == rating.creatorID) {
    res.status(400).send()
    return
  }

  try {
    // Retrieve user who created the listing
    const userSnapshot = await db
      .collection("users")
      .doc(rating.creatorID)
      .get()

    // User does not exists so we terminate
    if (!userSnapshot.exists) {
      res.status(400).send()
      return
    }

    // Check if requester has liked the listing
    const listingSnapshot = await db
      .collection("listings")
      .doc(rating.listingID)
      .get()
    const likers = listingSnapshot.data().likes
    let isALiker = false
    for (let i = 0; i < likers.length; i += 1) {
      if (likers[i] == uid) {
        isALiker = true
        break
      }
    }
    if (!isALiker) {
      res.status(400).send()
      return
    }

    // Retrieve existing rating (if it exists)
    const ratingSnapshot = await db
      .collection("ratings")
      .where("userID", "==", uid)
      .where("listingID", "==", rating.listingID)
      .get()
    const user = userSnapshot.data()

    // Add new entry
    if (ratingSnapshot.empty) {
      const updatedNumOfRaters = user.numOfRaters + 1
      const updatedTotalStars = user.totalStars + rating.overall
      const updatedRating = updatedTotalStars / updatedNumOfRaters
      await Promise.all([
        db.collection("ratings").add(rating),
        db.collection("users").doc(rating.creatorID).update({
          numOfRaters: updatedNumOfRaters,
          totalStars: updatedTotalStars,
          rating: updatedRating,
        }),
      ])
    }
    // Or update existing
    else {
      for (const ratingDoc of ratingSnapshot.docs) {
        const oldValue = ratingDoc.data().overall
        const updatedNumOfRaters = user.numOfRaters
        const updatedTotalStars = user.totalStars - oldValue + rating.overall
        const updatedRating = updatedTotalStars / updatedNumOfRaters
        await Promise.all([
          db.collection("ratings").doc(ratingDoc.id).update(rating),
          db.collection("users").doc(rating.creatorID).update({
            numOfRaters: updatedNumOfRaters,
            totalStars: updatedTotalStars,
            rating: updatedRating,
          }),
        ])
      }
    }
    res.status(200).send()
  } catch (error) {
    console.log("There was an error updating the rating:", error)
    res.status(500).send()
  }
})

app.post("/count-locations", async (req, res) => {
  const { location, date } = req.body
  console.log(date)

  try {
    const count = await countListings(location, date)
    res.status(200).json({count: count}).send()
  } catch (error) {
    console.log("Error encountered when counting locations", error)
    res.status(400).send()
  }
})

const port = 5000

app.listen(port, () => console.log("Listening on " + port))
