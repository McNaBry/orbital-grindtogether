const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require("./grindtogether-a123b-firebase-adminsdk-r5k9c-abc27d783a.json");

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://grindtogether-a123b-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore();
module.exports = db;
