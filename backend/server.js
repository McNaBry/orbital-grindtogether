const express = require("express");
const cors = require("cors");

const app = express();
const { db, fireAuth } = require("./firebase");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data

app.post("/auth", (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.redirect("http://localhost:3000/study-listings");
});

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

const port = 5000;

app.listen(port, () => console.log("Listening on " + port));
