const express = require("express")
const cors = require("cors")

const app = express()
const db = require("./firebase")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : true})) // To parse form data

app.post("/auth", (req, res) => {
  const formData = req.body
  console.log(formData)
  res.redirect("http://localhost:3000/study-listings")
});

app.get("/firebase", async (req, res) => {
  const snapshot = await db.collection('users').get()
  const data = {}
  snapshot.forEach((doc) => {
    data[doc.id] = doc.data()
  })
  console.log("Data prepared and ready to be delivered")
  res.send(JSON.stringify(data))
})

const port = 5000

app.listen(port, () => console.log("Listening on " + port));