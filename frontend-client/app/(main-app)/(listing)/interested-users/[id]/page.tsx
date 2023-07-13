"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { ListGroup, ListGroupItem } from "react-bootstrap"

type InterestedUsersProps = {
  params: { id: string } // listing UID
  searchParams: any
}

function InterestedUsers({ params, searchParams }: InterestedUsersProps) {
  const router = useRouter()
  // Retrieve URL search params
  const urlParams = new URLSearchParams(searchParams)
  const interestedUsers = urlParams.get("interestedUsers")
  console.log("INTERESTED USERS: ", interestedUsers)
  console.log("PARAM: ", params)
  const interestedUsersArr = interestedUsers ? JSON.parse(interestedUsers) : []

  return (
    <div>
      <h1 style={{ color: "white" }}> Interested Users Page </h1>
      <ListGroup>
        {/* Should use a more unique key rather the user's name */}
        {interestedUsersArr.map((user: string) => (
          <ListGroupItem key={user}>
            <Link href = {{pathname: "/profile-page", query: {name: user }}}>
              <p>{user} </p>
            </Link>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  )
}

export default InterestedUsers
