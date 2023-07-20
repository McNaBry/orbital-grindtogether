const { db, bucket } = require("./firebase")

async function getProfilePic(userID) {
  const file = bucket.file(`${userID}.png`)
  return await file.exists()
    .then(async ([exists]) => {
      let signedUrl = ""
      if (exists) {
        signedUrl = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000, // Expiry date of the URL
        })
      }
      return signedUrl
    }).catch(error => {
      console.log("Error checking if file exists:\n", error)
      return ""
    })
}

async function getFullProfile(userID) {
  const userRef = await db.collection("users").doc(userID).get()
  if (!userRef.exists) return null

  let userData = userRef.data()
  delete userData.likes
  delete userData.listings
  const profilePic = await getProfilePic(userID)
  userData = {
    ...userData,
    profilePic: profilePic
  }
  return userData
}

async function getViewProfile(userID) {
  const fullProfile = await getFullProfile(userID)
  return fullProfile == null 
    ? null
    : { 
      fullName: fullProfile.fullName,
      bio: fullProfile.bio,
      course: fullProfile.course,
      year: fullProfile.year,
      teleHandle: fullProfile.teleHandle,
      rating: fullProfile.rating,
      numOfRaters: fullProfile.numOfRaters,
      profilePic: fullProfile.profilePic
    }
}

async function getInterestProfile(userID) {
  const fullProfile = await getFullProfile(userID)
  return fullProfile == null 
    ? null
    : [ 
      userID,
      fullProfile.fullName,
      fullProfile.teleHandle,
      fullProfile.profilePic
    ]
}

async function updateProfile(userID, fieldToUpdate, value) {
  try {
    await db
      .collection("users")
      .doc(userID)
      .update({ [fieldToUpdate]: value })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

async function deleteProfilePic(userID) {
  try {
    const fileRef = bucket.file(`${userID}.png`)
    fileRef.delete()
    console.log('File deleted successfully')
    return true
  } catch (error) {
    console.log("Profile Pic Deletion Error:\n")
    console.log(error)
    return false
  }
}

async function setProfilePic(userID, file) {
  if (!file) {
    console.log("No file detected")
    return false
  }

  // If file given is empty, then user wants to DELETE the profile pic
  if (file.buffer.length == 0) {
    return await deleteProfilePic(userID)
  }
   
  // If not, create a new profile pic or overwrite the existing one
  try {
    const fileRef = bucket.file(`${userID}.png`)
    const uploadStream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    let uploadStatus = false
    uploadStream.on('error', (error) => {
      console.error('Error uploading file:\n', error); 
    })
    uploadStream.on('finish', () => {
      console.log('File uploaded successfully');
      uploadStatus = true
    })
  
    // Pipe the file stream from Multer to the write stream
    // end basically allows one last write before it closes the stream
    uploadStream.end(file.buffer)
    return uploadStatus
  } catch (error) {
    console.log("Profile Pic Upload Error:\n", error)
    return false
  }
}

module.exports = {
  getFullProfile,
  getViewProfile,
  getInterestProfile,
  updateProfile,
  setProfilePic
}