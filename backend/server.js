const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./firebase");

const pc = require("../frontend-client/app/(authentication)/sign-up/passwordChecks.js");

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
  const formData = {
    "Full Name": req.body.fullName,
    "Email": req.body.email,
    "Password": req.body.password,
  };

  // this code works but im tryna implement conditional below and it doesnt work
  try {
    await db.collection("users").add(formData);
    console.log("Account successfully created!");
    res.redirect("http://localhost:3000/study-listings");
  } catch (error) {
    console.error("Error occurred while saving data to Firebase: ", error);
    res
      .status(500)
      .json({ error: "An error occurred while saving the form data" });
  }

  // try {
  //   if (!pc.checkPassword(formData.password, req.body.confirmPassword)) {
  //     // res.status(400).json({ success: false, error: "Passwords entered do not match" });
  //   } else if (!pc.atLeast8Char(formData.password)) {
  //     // res.status(400).json({ success: false, error: "Password should be at least 8 characters long"});
  //   } else if (!pc.atLeastOneCap(formData.password)) {
  //     // res.status(400).json({ success: false, error: "Password should have at least one capital letter"});
  //   } else if (!pc.atLeastOneLower(formData.password)) {
  //     // res.status(400).json({ success: false, error: "Password should at least have one lowercase letter"});
  //   } else if (!pc.atLeastOneNumber(formData.password)) {
  //     // res.status(400).json({ success: false, error: "Password should at least have one number"});
  //   } else if (!pc.atLeastOneSpecial(formData.password)) {
  //     // res.status(400).json({ success: false, error: "Password should at least have one special character"});
  //   } else {
  //     await db.collection("users").add(formData);
  //     console.log("Account successfully created!");
  //     res.redirect("http://localhost:3000/study-listings");
  //   } 
  // } catch (error) {
  //   // console.error("Error occurred while saving data to Firebase: ", error);
  //   // res
  //   //   .status(500)
  //   //   .json({ error: "An error occurred while saving the form data" });
  // }
});

const port = 5000;

app.listen(port, () => console.log("Listening on " + port));
