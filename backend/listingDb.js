const { db, FieldValue } = require("./firebase")
const { getInterestProfile } = require("./profile.js")

async function getListing(listingUID) {
  const docRef = await db.collection("listings").doc(listingUID).get()
  if (!docRef.exists) return null
  return docRef.data()
}

async function getListings(userID) {
  const snapshot = await db
    .collection("listings")
    .orderBy("dateCreated", "desc")
    .get()
  return await processListings(userID, snapshot)
}

async function createListing(userID, data) {
  const listing = {
    createdBy: userID,
    title: data.title,
    desc: data.desc,
    tags: {
      modules: data.tags.modules,
      locations: data.tags.locations,
      faculties: data.tags.faculties,
    },
    date: data.date,
    dateCreated: data.dateCreated,
    freq: data.freq,
    interest: 0,
    likes: [],
  }
  const docRef = await db.collection("listings").add(listing)
  console.log("New listing added with ID:", docRef.id)
  return !docRef.empty
}

async function updateListing(userID, listingUID, data) {
  const listingRef = db.collection("listings").doc(listingUID)
  const listingData = (await listingRef.get()).data()
  if (listingData.createdBy != userID) return false

  const updatedListing = {
    title: data.title,
    desc: data.desc,
    tags: {
      modules: data.tags.modules,
      locations: data.tags.locations,
      faculties: data.tags.faculties,
    },
    date: data.date,
    dateCreated: data.dateCreated,
    freq: data.freq,
    expired: false
  }

  try {
    await listingRef.update(updatedListing)
    console.log("Successfully updated record")
    return true
  } catch (error) {
    console.error("Error occurred when updating record", error)
    return false
  }
}

async function deleteListing(userID, listingUID) {
  const docRef = await db.collection("listings").doc(listingUID).get()
  if (!docRef.exists) {
    return false
  }
  const listingData = docRef.data()
  if (listingData.createdBy != userID) {
    return false
  }
  return await db
    .collection("listings")
    .doc(listingUID)
    .delete()
    .then((res) => true)
    .catch((err) => false)
}

async function likeListing(userID, listingUID, action) {
  console.log(
    "User ID: ", userID,
    " Listing ID: ", listingUID,
    " action: ", action
  )
  const listingRef = db.collection("listings").doc(listingUID)
  const listingData = (await listingRef.get()).data()
  // Limit max no. of users that like a listing to be 20
  if (listingData.likes.length >= 20) return false
  const updateListingRes = await listingRef
    .update({
      likes:
        action == "like"
          ? FieldValue.arrayUnion(userID)
          : FieldValue.arrayRemove(userID),
      interest:
        action == "like" ? FieldValue.increment(1) : FieldValue.increment(-1),
    })
    .then((res) => true)
    .catch((err) => {
      console.log(err)
      return false
    })
  if (!updateListingRes) return false
  return await db
    .collection("users")
    .doc(userID)
    .update({
      likes:
        action == "like"
          ? FieldValue.arrayUnion(listingUID)
          : FieldValue.arrayRemove(listingUID),
    })
    .then((res) => true)
    .catch((err) => {
      console.log(err)
      return false
    })
}

// Function that processes listings obtained from a Firestore Query snapshot
// As references to users are stored by their doc UID, it needs to be converted to the user's fullname
async function processListings(userID, listingSnapshot) {
  const results = []
  // Note: Can't use forEach. Have to use a for..of loop for async
  for (const doc of listingSnapshot.docs) {
    let docData = doc.data()
    const user = await db.collection("users").doc(docData.createdBy).get()
    const userData = user.data()
    docData = {
      ...docData,
      id: doc.id,
      creatorName: !user.exists ? "Anonymous" : userData.fullName,
      liked: docData.likes.includes(userID),
    }
    results.push(docData)
  }
  return results
}

async function getLikedListings(userID) {
  const snapshot = await db
    .collection("listings")
    .where("likes", "array-contains", userID)
    .orderBy("dateCreated", "desc")
    .get()
  const results = []
  snapshot.forEach((doc) => {
    results.push(doc.data())
  })
  return await processListings(userID, snapshot)
}

async function getCreatedListings(userID) {
  const snapshot = await db
    .collection("listings")
    .where("createdBy", "==", userID)
    .orderBy("dateCreated", "desc")
    .get()
  return await processListings(userID, snapshot)
}

async function getListingLikers(listingID) {
  const snapshot = await db.collection("listings").doc(listingID).get()
  const likersInfo = []

  if (snapshot.exists) {
    const likers = snapshot.data().likes
    // console.log("Likers UID: ", likers)

    for (let i = 0; i < likers.length; i += 1) {
      // console.log("Liker: ", likers[i])
      const profile = getInterestProfile(likers[i])
      if (profile != null) likersInfo.push(profile)
    }
  }

  return Promise.all(likersInfo)
}

async function countListings(location, date) {
  if (location == "" || location == undefined || date == "" || date == undefined) return 0
  const dateGiven = new Date(date)
  const snapshot = await db
    .collection("listings")
    .where("tags.locations", "array-contains", location)
    .where("expired", "==", false)
    .get()
  let count = 0
  snapshot.forEach(doc => {
    const docData = doc.data()
    const docDate = new Date(docData.date)
    // Check if listing falls on the day itself
    if (docData.freq == "One time only") {
      if (docDate >= dateGiven) count += 1
    // Check if the date given is a weekend.
    // If yes, then the listing is valid on that date.
    } else if (docData.freq == "Weekends") {
      const day = dateGiven.getDay()
      if (day == 0 || day == 6) count += 1
    // Check if the difference in days between the date given and the listing date 
    // is a multiple of 7
    } else if (docData.freq == "Once a week") {
      const rawDiff = Math.abs(dateGiven - docDate)
      // console.log("Date given: ", dateGiven, " Date of listing: ", docDate, " Raw Diff: ", rawDiff)
      const dayDiff = Math.ceil(rawDiff / (1000 * 60 * 60 * 24))
      if (dayDiff % 7 == 0) count += 1
    }
  })
  return count
}

module.exports = {
  getListing,
  getListings,
  createListing,
  updateListing,
  deleteListing,
  likeListing,
  processListings,
  getLikedListings,
  getCreatedListings,
  getListingLikers,
  countListings
}
