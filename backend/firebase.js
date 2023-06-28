const admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore');

const NodeRSA = require('node-rsa')
const encryptedJSON = require('./gt-serviceacc-encrypt.json')
const key = new NodeRSA()
// Import private key for decryption
key.importKey(process.env.RSA_PRIVATE_KEY, process.env.DECRYPT_SCHEME)
// Retrieve encrypted string
// const encryptedString = fs.readFileSync(__dirname + `/${process.env.SERVICE_ACC_PATH}`, 'utf-8')
const encryptedString = process.env.SERVICE_ACC_ENCRYPT
// Decrypt the string and parse it into a JSON object
const serviceAccount = JSON.parse(key.decrypt(encryptedJSON.encryptedString, 'utf8'))

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