const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require("./grindtogether-a123b-firebase-adminsdk-r5k9c-abc27d783a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grindtogether-a123b-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore();
const fireAuth = admin.auth();
const EmailAuthProvider = admin.auth.EmailAuthProvider;

module.exports = {
  db, fireAuth, EmailAuthProvider
}