"use client"

/**
 * Top level component that allows any component wrapped in it to access
 * the object/methods stored in the value attribute. Children components
 * access it via the useContext() hook and passing in authContext 
 * 
 * To achieve this effect, this component exports useAuth() which is a
 * wrapper method that automatically does the above and simply allows the
 * children components to access the data in a single function call.
 */

import { useState, useContext, createContext, useEffect } from "react"

type user = {
  uid: string,
  verified: boolean,
  fullName: string
}

type authProvider = {
  user: user,
  signIn: (tokenID: string) => Promise<void>,
  signOut: () => Promise<void>
}

const defaultUser: user = {
  uid: "",
  verified: false,
  fullName: "Guest",
}

const defaultAuthObj: authProvider = {
  user: defaultUser,
  signIn: async (tokenID: string) => console.log(tokenID),
  signOut: async () => {}
}

// Creates the context object
// Accepts a default value which is  
const authContext = createContext<authProvider>(defaultAuthObj)

// AuthProvider component that wraps the components passed into it via children
// Components will interact with it via useAuth()
export default function AuthProvider({children} : {children : any}) {
  const auth = useAuthProvider()
  let validate = false
  useEffect(() => {
    const valUser = async () => await validateUser(window.localStorage.getItem("tokenID")).then(data => validate = true)
    valUser()
  }, [])
  return (
    <authContext.Provider value={auth}>{children}</authContext.Provider>
  )
}

// Hook that allows child components to access the object within useContext
// Causes components that rely on it to re-render upon change
export const useAuth = () => {
  return useContext(authContext)
}

// Function that POST a request to validate stored Firebase tokenID
async function validateUser(tokenID: string | null) {
  console.log("Token to be validated: ", tokenID)
  if (tokenID == null) return false
  // By right, this request should be send to a proxy API using Next.js
  // This will allow us to access httpOnly cookies and is more secure
  // However, for now this will do.
  const res = await fetch("http://localhost:5000/validate-token", {
    method: 'POST',
    headers : {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({tokenID: tokenID})
  })
  // If request is successful, server returns...
  // User's firestore document UID and full name.
  .then(payload => {
    payload.json().then(data => {
      window.localStorage.setItem("uid", data.uid)
      window.localStorage.setItem("fullName", data.fullName)
      console.log("User data from backend: ", data)
      return true
    })
  })
  // If not successful, we log the error and do nothing
  .catch(err => {
    console.log(err)
    return false
  })
  
  return !res ? false : true
}

function getStoredUser() {
  const uid = window.localStorage.getItem("uid")
  const fullName = window.localStorage.getItem("fullName")
  const profile: user = {
    uid: uid != null ? uid : "",
    verified: true,
    fullName: fullName != null ? fullName : ""
  }
  return profile
}

// Function that exposes necessary data to children component
function useAuthProvider() {
  // User profile that components can use to determine if user is signed in
  const [user, setUser] = useState<user>(defaultUser)

  useEffect(() => {
    const storedUser = getStoredUser()
    const userProfile: user = 
      storedUser.uid == null || storedUser.fullName == null 
      ? defaultUser
      : storedUser
    setUser(userProfile)
  }, [])

  async function signIn(tokenID: string) {
    window.localStorage.setItem("tokenID", tokenID)
    const res = await validateUser(tokenID)
    if (res) setUser(getStoredUser())
  }

  async function signOut() {
    window.localStorage.removeItem("uid")
    window.localStorage.removeItem("fullName")
    window.localStorage.removeItem("tokenID")
  }

  return {
    user, signIn, signOut
  }
}

