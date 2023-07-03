const { db } = require("./firebase")

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
      modules: data.tags.modules,
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

async function updateListing(userID, listingUID, fieldToUpdate, newValue) {
  // TODO
}

async function deleteListing(userID, listingUID) {
  console.log("userID: ", userID, " listingID: ", listingUID)
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
  processListings,
  getLikedListings, 
  getCreatedListings
}