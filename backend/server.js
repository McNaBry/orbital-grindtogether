// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
// const nodemailer = require("nodemailer");

const app = express();
const { db, fireAuth, EmailAuthProvider } = require("./firebase");

const apiKey = process.env.FIREBASE_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data

// app.post("/auth", (req, res) => {
//   const formData = req.body;
//   console.log(formData);
//   res.redirect("http://localhost:3000/study-listings");
// });

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
    bio: "Hello!",
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
    res.status(500).send();
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
  const signInRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    { email: email, password: password, returnSecureToken: true }
  ).catch(err => {
    return res.status(500)
  })

  if (signInRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(500).send()
  }
});

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
    return res.status(500)
  })

  if (resetEmailRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(500).send()
  }
});

// API Endpoint to validate oob code for password reset
app.post('/validate-oob', async (req, res) => {
  const { oobCode } = req.body;
  const validateOobRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
    { oobCode: oobCode }
  ).catch(err => {
    return res.status(500)
  })

  if (validateOobRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(500).send()
  }
})

// API Endpoint to reset password with valid oob code
app.post('/reset-password', async (req, res) => {
  const { oobCode, newPassword } = req.body;
  const resetPasswordRes = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${apiKey}`,
    { oobCode: oobCode, newPassword: newPassword }
  ).catch(err => {
    return res.status(500)
  })

  if (resetPasswordRes.status == 200) {
    res.status(200).send()
  } else {
    res.status(500).send()
  }
})

function deleteCurrentUser(user, res) {
  user.delete()
    .then(() => {
      res.status(200).send();
      console.log("User data successfully deleted");
    })
    .catch((error) => {
      res.status(500).send();
      console.log("User data couldn't be deleted", error);
    });
}

app.delete("/delete-account", async (req, res) => {
  const { email, password } = req.body;
  const userRecord = await fireAuth.getUserByEmail(email);

  // might remove when connecting backend of profile page to delete account in the future
  // if (!userRecord) {
  //   console.log("User not found");
  //   res.status(400).send("User not found");
  //   return;
  // }

  const user = await fireAuth.getUser(userRecord.uid);

  try {
    // await fireAuth.signInWithEmailAndPassword(email, password);

    const credential = admin.auth.EmailAuthProvider.credential(email, password); 
    console.log(credential);
    await user.reauthenticateWithCredential(credential);
    // delete user information from database
    await db.collection("users").doc(user.uid).delete();
    deleteCurrentUser(user, res);
  } catch (error) {
    res.status(400).send();
  }
});

// app.post("/create-listing", async (req, res) => {
//   const listing = {
//     "title": req.body.,
//     "description": req.body.,
//     "modules": req.body.,
//     "location": req.body,
//     "date": ,
//     "frequency":
//   };

//   try {
//     await fireAuth.createUser({
//       email: user.email,
//       emailVerified: true,
//       password: user.password,
//       displayName: user.fullName,
//       disabled: false,
//     }).then(async () => {
//       await db.collection("users").add(user).then(() => {
//         console.log("Listing successfully created")
//         res.send(200)
//       })
//     })
//   } catch (error) {
//     console.error("Error occurred while saving data to Firebase: ", error);
//     res.status(500)
//     return
//   }
// });

const port = 5000;

app.listen(port, () => console.log("Listening on " + port));
