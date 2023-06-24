const { db } = require("./firebase");

async function getLikedListings(userID) {
  const snapshot = await db
    .collection("listings")
    .where("likes", "array-contains", userID)
    .orderBy("date")
    .get();
  const results = [];
  snapshot.forEach((doc) => {
    results.push(doc.data());
  });
  return results;
}

async function getCreatedListings(userID) {
  const snapshot = await db
    .collection("listings")
    .where("createdBy", "==", userID)
    .orderBy("date")
    .get();
  const results = [];
  snapshot.forEach((doc) => {
    results.push(doc.data());
  });
  return results;
}

module.exports = {
  getLikedListings,
  getCreatedListings,
};