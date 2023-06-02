require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

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

app.post("/sign-up", async (req, res) => {
  const user = {
    "fullName": req.body.fullName,
    "email": req.body.email,
    "password": req.body.password,
    "bio": "Hello!",
    "rating": 0
  };

  try {
    await fireAuth.createUser({
      email: user.email,
      emailVerified: true,
      password: user.password,
      displayName: user.fullName,
      disabled: false,
    }).then(async () => {
      await db.collection("users").add(user).then(() => {
        console.log("Account successfully created")
        res.send(200)
      })
    })
  } catch (error) {
    console.error("Error occurred while saving data to Firebase: ", error);
    res.status(500)
    return
  }
});

app.post("/sign-in", async (req, res) => {
  const {email, password} = req.body;

  try {
    const snapshot = await db.collection("users").where("email", "==", email).get();
    if (snapshot.empty) {
      console.log("Email not found in database");
      res.status(404).send();
      return;
    } 

    // assumes that there is only one record that matches the email
    const userData = snapshot.docs[0].data();
    const storedPassword = userData.password;

    if (password != storedPassword) {
      console.log("Passwords do not match");
      res.status(401).send();
      return;
    }

    const signInResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );
    console.log("Login successful");
    res.status(200).send();
    return 
  } catch (error) {
    console.log("god help us ", error);
    res.status(500).send();
    return
  }
})

const port = 5000;

app.listen(port, () => console.log("Listening on " + port));
