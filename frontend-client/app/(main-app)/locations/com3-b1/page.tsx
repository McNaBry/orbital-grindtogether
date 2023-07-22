"use client"

import { useState, useEffect } from "react"
import LocationButton from "../locationButton"
import "../locations.css"

const layout = "/images/com3-basement1.png"

function COM3B1() {
  const [count, setCount] = useState(0)

  const fetchCount = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/count-locations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: ["Basement 1"]
        })
      }
    )

    if (!res.ok) {
      throw new Error("Error fetching count")
    }

    const data = await res.json()
    setCount(data.count)
  }

  useEffect(() => {
    fetchCount()
  }, [count])

  return (
    <div className="com3-layout">
      <LocationButton />
      <div className="layout-container">
        <img src={layout} alt="COM3 Basement 1 Layout" />
      </div>
      <p className="locations-count"> {count} </p>
    </div>
  )
}

export default COM3B1
