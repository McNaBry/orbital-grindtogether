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
  deleteAccount,
  sendResetLink,
  validateOob,
  validateToken
}