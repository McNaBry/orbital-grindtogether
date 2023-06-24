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

module.exports = {
  signInUser,
  deleteAccount
}