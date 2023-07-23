// Functions to faciliate management of location collection in firestore
require("dotenv").config()
const { db } = require("./firebase")

const days = ["sun", "mon", "tue", "wed", "thurs", "fri", "sat"]
async function initalizeLocation(location) {
  if (location == "" || location == undefined) return
  const emptyDay = {}
  for (let i = 0; i < 24; i++) {
    emptyDay[i] = "0,0,0"
  }
  const newLocationListing = {
    name: location
  }
  for (const day in days) {
    newLocationListing[days[day]] = emptyDay
  }
  
  await db.collection("locations").doc(location).set(newLocationListing)
}

// initalizeLocation("Benches @ LT-19").catch(error => console.log(error))

async function retrieveLocationCrowd(location, date) {
  if (location == "" || date == "") return {}
  const day = new Date(date).getDay()
  try {
    const locationSnapshot = await db.collection("locations").doc(location).get()
    if (!locationSnapshot.exists) return {}
    const locationData = locationSnapshot.data()
    const dayData = locationData[days[day]]
    const processedData = {}
    Object.keys(dayData).forEach(key => {
      const slicedData = dayData[key].split(",")
      processedData[key] = `${slicedData[0]},${slicedData[1]}`
    })
    return processedData
  } catch (error) {
    return {}
  }
}

async function updateLocationCrowd(location, day, time, updateCrowd) {
  if (location == "" 
    || day < 0 || day > 6 
    || time < 0 || time > 23
    || updateCrowd < 1 || updateCrowd > 4) return false
  const fieldString = `${days[day]}.${time}`
  try {
    const locationSnapshot = await db.collection("locations").doc(location).get()
    if (!locationSnapshot.exists) return false

    const crowdValues = (locationSnapshot.data()[days[day]])[time].split(",")
    const adminValue = crowdValues[0]
    const oldUserValue = parseInt(crowdValues[1])
    const count = parseInt(crowdValues[2])
    const newCrowdLevel = parseFloat((((oldUserValue * count) + updateCrowd) / (count + 1)).toFixed(5))

    await db.collection("locations").doc(location)
      .update({
        [fieldString]: `${adminValue},${newCrowdLevel},${parseInt(count) + 1}`
      })
    return true
  } catch (error) {
    return false
  }
}

// retrieveLocationCrowd("Terrace", new Date().toDateString())
// updateLocationCrowd("Terrace", 0, 4, 3)

module.exports = {
  retrieveLocationCrowd,
  updateLocationCrowd
}