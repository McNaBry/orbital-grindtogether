// Functions to faciliate management of location collection in firestore
require("dotenv").config()
const { db } = require("./firebase")

const days = ["sun", "mon", "tue", "wed", "thurs", "fri", "sat"]
async function initalizeLocation(location) {
  if (location == "" || location == undefined) return
  const emptyDay = {}
  for (let i = 0; i < 24; i++) {
    emptyDay[i] = "0,0"
  }
  const newLocationListing = {
    name: location
  }
  for (const day in days) {
    newLocationListing[days[day]] = emptyDay
  }
  
  await db.collection("locations").doc(location).set(newLocationListing)
}

// initalizeLocation("Basement 1").catch(error => console.log(error))

async function retrieveLocationCrowd(location, date) {
  if (location == "" || date == "") return
  const day = new Date(date).getDay()
  try {
    const locationSnapshot = await db.collection("locations").doc(location).get()
    if (!locationSnapshot.exists) return null
    const locationData = locationSnapshot.data()
    const dayData = locationData[days[day]]
    return dayData
  } catch (error) {
    return null
  }
}

async function updateLocationCrowd(location, day, time, updateCrowd) {
  if (location == "" 
    || day < 0 || day > 6 
    || time < 0 || time > 23
    || updateCrowd < 0 || updateCrowd > 4) return false
  const fieldString = `${days[day]}.${time}`
  try {
    const locationSnapshot = await db.collection("locations").doc(location).get()
    if (!locationSnapshot.exists) return null
    const adminValue = (locationSnapshot.data()[days[day]])[time].split(",")[0]
    console.log(adminValue)
    const updateLocation = await db.collection("locations").doc(location)
      .update({
        [fieldString]: `${adminValue},${updateCrowd}`
      })
    return true
  } catch (error) {
    return false
  }
}

// retrieveLocationCrowd("Terrace", new Date().toDateString())
// updateLocationCrowd("Terrace", 0, 4, 2)

module.exports = {
  retrieveLocationCrowd,
  updateLocationCrowd
}