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

import { useState, useContext, createContext } from "react"

type user = {
  uid: string,
  fullName: string
}

// Creates the context object
// Accepts a default value which is  
const authContext = createContext(null)

// Component that wraps the components passed into it via children
// Components will interact with it via useAuth()
export default function AuthProvider({children} : {children : any}) {
  const auth = authContext
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

// Hook that allows child components to access the object within useContext
// Causes components that rely on it to re-render upon change
export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {


}

