"use client"

import useSWRImmutable from 'swr/immutable'
import Cookies from 'universal-cookie'

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
  verified: false,
  fullName: string
}

// type authProviderContext = user & {
//   validateUser: (tokenID: string, setUser: (user: user) => void) => void
// }

const defaultUser:user = {
  uid: "",
  verified: false,
  fullName: "Guest"
}

// Creates the context object
// Accepts a default value which is  
const authContext = createContext<user>(defaultUser)

// AuthProvider component that wraps the components passed into it via children
// Components will interact with it via useAuth()
export default function AuthProvider({children} : {children : any}) {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook that allows child components to access the object within useContext
// Causes components that rely on it to re-render upon change
export const useAuth = () => {
  return useContext(authContext)
}

export async function validateUser(tokenID: string, setUser: (user: user) => void) {
  console.log("Auth Provider: ", tokenID)
  const res = await fetch("http://localhost:5000/validate-token", {
    method: 'POST',
    headers : {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({tokenID: tokenID})
  })
  // If request is successful and the server returns a user profile
  .then(payload => {
    payload.json().then(data => {
      setUser(({...data, verified: true}))
      console.log("AUTH PROVIDER:", data)
      return
    })
  })
  // If not successful, we log the error and do nothing
  .catch(err => {
    console.log(err)
  })
}

// Contains the user data
function useAuthProvider() {
  const [user, setUser] = useState<user>({
    uid: "",
    verified: false,
    fullName: "Guest"
  })

  const cookies = new Cookies()
  const tokenID = cookies.get("tokenID")
  // console.log("Auth Provider: ", tokenID)
  if (!tokenID) return user
  
  useEffect(() => {
    validateUser(tokenID, setUser)
  }, [])

  return user
}

