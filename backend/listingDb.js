const { db, FieldValue } = require("./firebase")

async function getListing(listingUID) {
  const docRef = await db
    .collection("listings")
    .doc(listingUID)
    .get()
}

async function getListings() {
  const snapshot = await db
    .collection("listings")
    .orderBy("date")
    .get()
  return await processListings(snapshot)
}

async function createListing(userID, data) {
  const listing = {
    createdBy: data.userID,
    title: data.title,
    desc : data.desc,
    tags : {
      modules  : data.tags.modules,
      locations: data.tags.locations,
      faculties: data.tags.faculties
    },
    date : data.date,
    freq : data.freq,
    interest: 0,
    likes: []
  }
  const docRef = await db.collection("listings").add(listing)
  console.log("New listing added with ID:", docRef.id)
  return !docRef.empty
}

async function updateListing(listingUID, data) {
  // TODO
  const docRef = await db.collection("listings").doc(listingUID)
  console.log(docRef)
  try {
    await docRef.update(data)
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
  return await db.collection("listings").doc(listingUID)
    .delete()
    .then(res => true)
    .catch(err => false)
}

async function likeListing(userID, listingUID, action) {
  console.log("User ID: ", userID, " Listing ID: ", listingUID, " action: ", action)
  const listingRef = db.collection("listings").doc(listingUID)
  const listingData = (await listingRef.get()).data()
  // Limit max no. of users that like a listing to be 20
  if (listingData.likes.length >= 20) return false
  const updateListingRes = await listingRef
    .update({
      likes: action == "like" 
        ? FieldValue.arrayUnion(userID)
        : FieldValue.arrayRemove(userID)
    })
    .then(res => true)
    .catch(err => {
      console.log(err)
      return false
    })
  if (!updateListingRes) return false
  return await db.collection("users").doc(userID)
    .update({
      likes: action == "like" 
        ? FieldValue.arrayUnion(listingUID)
        : FieldValue.arrayRemove(listingUID)
    })
    .then(res => true)
    .catch(err => {
      console.log(err)
      return false
    })
}

// Function that processes listings obtained from a Firestore Query snapshot
// As references to users are stored by their doc UID, it needs to be converted to the user's fullname
async function processListings(listingSnapshot) {
  // if (!listingSnapshot.exists) return []
  const results = []
  // Note: Can't use forEach. Have to use a for..of loop for async 
  for (const doc of listingSnapshot.docs) {
    let docData = doc.data()
    const user = await db.collection('users').doc(docData.createdBy).get()
    const userData = user.data()
    docData = {
      ...docData,
      id: doc.id,
      createdBy: !user.exists ? "Anonymous" : userData.fullName
    }
    results.push(docData)
  }
  return results
}

async function getLikedListings(userID) {
  const snapshot = await db
    .collection('listings')
    .where('likes', 'array-contains', userID)
    .orderBy('date')
    .get()
  const results = []
  snapshot.forEach(doc => {
    results.push(doc.data())
  })
  return await processListings(snapshot)
}

async function getCreatedListings(userID) {
  const snapshot = await db
    .collection('listings')
    .where('createdBy', '==', userID)
    .orderBy('date')
    .get()
  return await processListings(snapshot)
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
  getCreatedListings
}