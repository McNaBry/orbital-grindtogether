// Firebase REST API: https://firebase.google.com/docs/reference/rest/auth

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");

const app = express();
const { db, fireAuth } = require("./firebase");

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

// Sign up API endpoint
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

// Sign in API endpoint
app.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;

  /* 
    Sends a POST request with user credentials to Firebase Auth API
    If sign in is successful a 200 OK HTTP status code is returned
  */
  const signInResponse = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    { email, password, returnSecureToken: true, }
  ).catch(err => {
    return res.status(500)
  })

  if (signInResponse.status == 200) {
    res.status(200).send()
  } else {
    res.status(500).send()
  }
});

async function sendEmail(to, subject, htmlContent) {
  try {
    // Create a transporter using SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "",
        pass: "",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Create the email message
    const message = {
      from: process.env.SMTP_FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

app.post("/input-email-for-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (snapshot.empty) {
      console.log("Email not found in database");
      res.status(404).send();
      return;
    }

    const userData = snapshot.docs[0].data();
    // send request to firebase to automate email and customise email automation
    const customUserToken = await fireAuth.createCustomToken(email);
    const subject = "reset your password lad";
    const emailContent = `
      <p>Click <a href="../reset-password?token=${customUserToken}"> here </a> to reset your password</p>
    `;

    sendEmail(email, subject, emailContent)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  } catch (error) {
    console.log("god help us ", error);
    res.status(500).send();
    return;
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
