"use client"

import { useEffect, useState } from "react"

type ViewProfileProps = {
  params: { id: string },
  searchParams: any
}

export default function ViewProfile({ params, searchParams } : ViewProfileProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fields, setFields] = useState({
    fullName: "",
    bio: "",
    year: 0,
    course: "",
    teleHandle: "@",
    rating: 0,
  })
  const [profilePic, setProfilePic] = useState("")

  // UseEffect hook to fetch profile data based on Firestore UID stored on local storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = params.id
        if (!uid || uid == undefined) return
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/view-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid }),
            credentials: "include",
          }
        )

        if (response.status == 200) {
          const data = await response.json()
          setFields(data)
          setProfilePic(data.profilePic || "")
          console.log(data)
          setIsLoading(false)
        } else {
          console.log("Profile fetch error")
        }
      } catch (error) {
        console.log("User not found.")
      }
    }

    fetchData()
  }, [])

  
  return (
    <div>

    </div>
  )
}