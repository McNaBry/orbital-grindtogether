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
  verified: boolean,
  fullName: string
}

type authProvider = {
  user: user,
  signUp: (email: string, uid: string) => Promise<void>,
  signIn: (fullname: string) => Promise<void>,
  signOut: () => Promise<void>
}

const defaultUser: user = {
  verified: false,
  fullName: "Guest",
}

const defaultAuthObj: authProvider = {
  user: defaultUser,
  signUp: async (email: string, uid: string) => console.log("sign up"),
  signIn: async (fullname: string) => console.log("sign in"),
  signOut: async () => {}
}

// Creates the context object
const authContext = createContext<authProvider>(defaultAuthObj)

// AuthProvider component that wraps the components passed into it via children
// Components will interact with it via useAuth()
export default function AuthProvider({children} : {children : any}) {
  const auth = useAuthProvider()
  //   useEffect(() => {
  //     validateUser().then(data => console.log("Validation success: ", data))
  // }, [])
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
async function validateUser() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate-token`, {
    method: 'POST'
  })
  // If request is successful, server returns...
  // User's firestore document UID and full name.
  if (res.ok) {
    const data = await res.json()
    window.localStorage.setItem("fullName", data.fullName)
    //console.log("User data from backend: ", data)
    return true
  } else {
    window.localStorage.removeItem("fullName")
    return false
  }
}

function getStoredUser() {
  const fullName = window.localStorage.getItem("fullName")
  const profile: user = {
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
      storedUser.fullName == null 
      ? defaultUser
      : storedUser
    setUser(userProfile)
  }, [])

  async function signUp(email: string, uid: string) {
    window.localStorage.setItem("fullName", email)
  }

  async function signIn(fullName: string) {
    window.localStorage.setItem("fullName", fullName)
    setUser(getStoredUser())
  }

  async function signOut() {
    window.localStorage.removeItem("fullName")
    setUser(defaultUser)
  }

  return {
    user, signUp, signIn, signOut
  }
}

