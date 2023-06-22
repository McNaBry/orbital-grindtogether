// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
// const nodemailer = require("nodemailer");
// const cookieParser = require("cookie-parser");
// const Cookies = require('universal-cookie')

const app = express();
const { db, fireAuth } = require("./firebase");
const authUtil = require("./authentication")

const apiKey = process.env.FIREBASE_API_KEY;

//app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data

// app.post("/auth", (req, res) => {
//   const formData = req.body;
//   console.log(formData);
//   res.redirect("http://localhost:3000/study-listings");
// });

async function getUserByEmail(email) {
  return await fireAuth.getUserByEmail(email).catch(err => null)
}

app.get("/firebase", async (req, res) => {
  const snapshot = await db.collection("users").get();
  const data = {};
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data();
  });
  console.log("Data prepared and ready to be delivered");
  res.send(JSON.stringify(data));
});

// API endpoint for Signing Up
app.post("/sign-up", async (req, res) => {
  /*
    Creates a user profile with the full-name and email 
    Uses default values for bio and rating 
    DOES NOT contain plaintext password as this will be handled by Firebase Auth
  */
  const user = {
    fullName: req.body.fullName,
    email: req.body.email,
    bio: "",
    year: 0,
    course: "",
    telegramHandle: "@",
    rating: 0,
  };

  /*
    Attempts to sign up the user with email and password on Firebase Auth
    Upon success, a new user document/profile is created on Firestore
    If the user's email already exists, Firebase Auth will throw an error
  */
  try {
    await fireAuth
      .createUser({
        email: user.email,
        emailVerified: true,
        password: req.body.password,
        displayName: user.fullName,
        disabled: false,
      })
      .then(async () => {
        await db
          .collection("users")
          .add(user)
          .then(() => {
            console.log("Account successfully created");
            res.status(200).send();
          });
      });
  } catch (error) {
    console.error("Error occurred while saving data to Firebase: ", error);
    res.status(400).send();
    return;
  }
});

// API endpoint for Signing In
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body
  /* 
    Sends a POST request with user credentials to Firebase Auth API
    If sign in is successful a 200 OK HTTP status code is returned
  */
  const signInRes = await authUtil.signInUser(email, password)
  // Retrieves the ID token that Firebase Auth returns when the user is signed in
  const tokenID = signInRes.data.idToken;

  if (signInRes.status == 200) {
    res.status(200).json({tokenID: tokenID}).send()
  } else {
    res.status(400).send()
  }
});

app.post("/validate-token", async (req, res) => {
  const { tokenID } = req.body
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
      users.push({uid: data.uid, fullName: data.fullName})
    })

    if (users.length != 1) {
      console.log("Null array for user UID query")
      res.status(400).send()
    } else if (users.length > 1) {
      // Under no circumstance should this happen.
      // But if our database has duplicate emails, then we log the "error"
      console.log("Error with query for user UID")
    }
    // If all goes well, we send back the first (and only) user extracted
    res.status(200).json(users[0]).send()
  } else {
    res.status(400).send()
  }
})

// async function sendEmail(to, subject, htmlContent) {
//   try {
//     // Create a transporter using SMTP settings
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "",
//         pass: "",
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     // Create the email message
//     const message = {
//       from: process.env.SMTP_FROM_EMAIL,
//       to,
//       subject,
//       html: htmlContent,
//     };

//     // Send the email
//     const info = await transporter.sendMail(message);
//     console.log("Email sent:", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// }

// API Endpoint to receieve email to send password reset link
app.post("/input-email-for-reset", async (req, res) => {
  const { email } = req.body;
  const resetEmailRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
    { requestType :"PASSWORD_RESET", email: email }
  ).catch(err => {
    return res.status(400)
  })

  if (resetEmailRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
});

// API Endpoint to validate oob code for password reset
app.post('/validate-oob', async (req, res) => {
  const { oobCode } = req.body;
  const validateOobRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
    { oobCode: oobCode }
  ).catch(err => {
    return res.status(400)
  })

  if (validateOobRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

// API Endpoint to reset password with valid oob code
app.post('/reset-password', async (req, res) => {
  const { oobCode, newPassword } = req.body;
  const resetPasswordRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
    { oobCode: oobCode, newPassword: newPassword }
  ).catch(err => {
    return res.status(400)
  })

  if (resetPasswordRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(400).send()
  }
})

app.delete("/delete-account", async (req, res) => {
  const { email, password } = req.body

  // Check if details given are valid by signing in
  const signInRes = await authUtil.signInUser(email, password)
  // Either email/password not valid or user is not in Firebase Auth
  if (signInRes.status != 200) {
    res.status(401).send();
  }

  // Get the user record to retrieve the UID for deletion
  const userRecord = await getUserByEmail(email)
  if (!userRecord) {
    console.log("No user record found with the email provided")
    return res.status(400).send()
  }

  // Delete user from Firebase Auth
  const deleteAccAuth = await authUtil.deleteAccount(userRecord.uid)
  if (!deleteAccAuth) {
    console.log("Deletion error")
    return res.status(400).send()
  }

  // Delete user from Firestore
  try {
    const snapshot = await db.collection("users").where("email", "==", email).get()
    snapshot.forEach(doc => doc.ref.delete())
    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
});

// middleware to extract token from cookie and verify it before use 
// const verifyIdToken = async (req, res, next) => {
//   const idToken = req.cookies.idToken;

//   if (!idToken) {
//     return res.status(401).send("Unauthorised");
//   }

//   try {
//     const decodedToken = await fireAuth.verifyIdToken(idToken);
//     const userId = decodedToken.uid;
//     const email = decodedToken.email;
    
//     // we will attach the user object to the req object to be passed around 
//     req.user = { userId, email }
//     next(); 
//   } catch (error) {
//     console.log('Failed to verify idToken:', error);
//     res.status(401).send('Unauthorized');
//   }
// }

// Get the data of the specific user to be displayed in the profile page
// app.get("/profile-page", verifyIdToken, async (req, res) => {
//   try {
//     const uid = req.user.userId;
//     const snapshot = await db.collection("users").doc(uid).get();

//     if (!snapshot.exists) {
//       console.log("no data found regarding particular user");
//       res.status(404).send();
//       return;
//     }

//     const userData = snapshot.data()
//     console.log("i successfully sent the data");
//     res.send(userData);
//   } catch (error) {
//     console.log("no data for you");
//     res.status(500).send();
//   }
// })

app.post("/get-profile", async (req, res) => {
  const {uid} = req.body
  const docRef = await db.collection("users").doc(uid).get()
  if (docRef.exists) {
    const userData = docRef.data()
    res.status(200).json(userData).send()
  } else {
    res.status(400).json({}).send()
  }
})

// Update the database when the user modifies a field in the profile page
app.post("/update-profile", async (req, res) => {
  try {
    const userId = req.user.userId;
    const updatedData = req.body;
    
    await db.collection("users").doc(userId).update(updatedData);

    console.log("updated successfully");
    res.status(200).send();
  } catch (error) {
    console.log("cannot update");
    res.status(500).send();
  }
})

const port = 5000;

app.listen(port, () => console.log("Listening on " + port));
