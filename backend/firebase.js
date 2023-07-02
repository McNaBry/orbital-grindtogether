const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const { getStorage } = require("firebase-admin/storage")

const serviceAccount = require("./grindtogether-a123b-firebase-adminsdk-r5k9c-abc27d783a.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://grindtogether-a123b-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "grindtogether-a123b.appspot.com"
});

const db = getFirestore();
const fireAuth = admin.auth();
const EmailAuthProvider = admin.auth.EmailAuthProvider;
const storage = getStorage();
const bucket = storage.bucket();

module.exports = {
  db, fireAuth, EmailAuthProvider, storage, bucket
}