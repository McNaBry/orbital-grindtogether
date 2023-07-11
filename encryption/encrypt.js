const NodeRSA = require('node-rsa');
const fs = require('fs')
const firebaseAcc = require("<PATH TO SERVICE ACCOUNT JSON>")

function genKeyPair() {
  const key = new NodeRSA({b: 512});

  // Encoded in pkcs8 scheme as pem string
  const publicKey = key.exportKey('pkcs8-public-pem');
  // Encoded in pkcs1 scheme as pem string
  const privateKey = key.exportKey('pkcs1-pem');

  console.log('\nPUBLIC:');
  console.log(publicKey);
  fs.writeFileSync("public_key.txt", publicKey, (err) => {
    if (err) console.log(err)
  })
  console.log('\nPRIVATE:');
  console.log(privateKey);
  fs.writeFileSync("private_key.txt", privateKey, (err) => {
    if (err) console.log(err)
  })

  return { public: publicKey, private: privateKey }
}

function encryptJSON(jsonObj, publicKey) {
  const key = new NodeRSA({b: 512});
  key.importKey(publicKey, 'pkcs8-public-pem');
  const encrypted = key.encrypt(JSON.stringify(jsonObj), 'base64');
  fs.writeFileSync("encrypted_key.txt", encrypted, (err) => {
    if (err) console.log(err)
  })
  console.log('ENCRYPTED:');
  console.log(encrypted);
  return "encrypted_key.txt"
}

function decryptJSON(filePath, privateKey) {
  try {
    const key = new NodeRSA({b: 512});

    // Import the private key
    const privatePem = privateKey;
    key.importKey(privatePem, 'pkcs1-pem');
  
    // Read saved encrypted string and decrypt it
    const encryptedString = fs.readFileSync(filePath, 'utf-8')
    const decryptedString = key.decrypt(encryptedString, 'utf8');
    console.log('\nDECRYPTED string: \n', decryptedString);
  
    // Parse the decrypted string into a JSON object
    const decryptedObject = JSON.parse(decryptedString);
    console.log('\nDECRYPTED object:\n', decryptedObject);

    return decryptedObject
  } catch (error) {
    console.log("ERROR DECRYPTING: ", error)
  }
}

const rsaKeys = genKeyPair()
const filePath = encryptJSON(firebaseAcc, rsaKeys.public)
decryptJSON(filePath, rsaKeys.private)
