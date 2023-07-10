const { db, fireAuth } = require("./firebase");
const axios = require("axios");

const apiKey = process.env.FIREBASE_API_KEY

async function signInUser(email, password) {
  return await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    { email: email, password: password, returnSecureToken: true }
  ).catch(err => {
    return err.response
  })
}

async function createAccount(data) {
  /*
    Creates a user profile with the full-name and email 
    Uses placeholder values for bio, course, telegramHandle, year and rating
    Posts is an array of doc ref to the listings that the user has created
    Likes is an array of doc ref to the listings that the user has liked 
    DOES NOT contain plaintext password as this will be handled by Firebase Auth
  */
  const user = {
    fullName: data.fullName,
    email: data.email,
    bio: "Hello!",
    course: "",
    teleHandle: "@",
    year: 0,
    rating: 0,
    listings: [],
    likes: []
  }

  /*
    Attempts to sign up the user with email and password on Firebase Auth
    Upon success, a new user document/profile is created on Firestore
    If the user's email already exists, Firebase Auth will throw an error
  */
  return await fireAuth
    .createUser({
      email: user.email,
      emailVerified: true,
      password: data.password,
      displayName: user.fullName,
      disabled: false,
    })
    .then(async payload => {
      return await db
        .collection("users")
        .add(user)
        .then(doc => {
          console.log("Firestore account successfully created")
          return true
        })
        .catch(err => {
          console.log("Firestore account creation err\n", err)
          return false
        })
    })
    .catch(err => {
      console.error("Auth account creation err\n", err)
      return true
    })
}

async function deleteAccount(tokenID) {
  return await fireAuth.deleteUser(tokenID)
  .then(payload => true)
  .catch(err => {
    console.log(err)
    return false
  })
}

async function sendResetLink(email) {
  const resetEmailRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
    { requestType :"PASSWORD_RESET", email: email }
  ).catch(err => {
    return res.status(400)
  })
  return resetEmailRes.status == 200
}

async function validateOob(oobCode) {
  const validateOobRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
    { oobCode: oobCode }
  )
  .catch(err => res.status(400))
  return validateOobRes.status == 200
}

async function validateToken(tokenID) {
  // Verify tokenID and get email associated with the ID
  const decodedToken = await fireAuth
    .verifyIdToken(tokenID)
    .then((decodedToken) => {
      return decodedToken.email
    })
    .catch((error) => {
      console.log(error)
      return ""
    })
  
  if (decodedToken != "") {
    const snapshot = await db.collection("users").where("email", "==", decodedToken).get()
    const users = []
    snapshot.forEach(doc => {
      const data = doc.data()
      users.push(({uid: doc.id, fullName: data.fullName}))
    })
    return users
  } else {
    return []
  }
}

module.exports = {
  signInUser,
  createAccount,
  deleteAccount,
  sendResetLink,
  validateOob,
  validateToken
}