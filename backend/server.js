const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true})) // To parse form data

app.post("/auth", (req, res) => {
  const formData = req.body
  console.log(formData)
  res.redirect("http://localhost:3000/study-listings")
});

const port = 5000

app.listen(port, () => console.log("Listening on " + port));