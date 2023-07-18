"use client"

import Link from "next/link"
import { ListGroup, ListGroupItem } from "react-bootstrap"
import interestStyles from "./interested-users.module.css"

type InterestedUsersProps = {
  params: { id: string } // listing UID
  searchParams: any
}

type User = {
  uid: string,
  name: string,
  teleHandle: string
}

function NoProfilePic() {
  return <div id={interestStyles["no-profile-pic"]}></div>
}

function UserEntry({ user } : { user: User }) {
  return (
    <div className={interestStyles["user-entry"]}>
      <div className={interestStyles["user-entry-left"]}>
        <NoProfilePic />
        <Link className={interestStyles["user-link"]} href={`/view-profile/${user.uid}`}>
          <p className={interestStyles["user-name"]}>{user.name}</p>
        </Link>
      </div>
      <p className={interestStyles["user-tele"]}>{user.teleHandle}</p>
    </div>
  )
}

function InterestedUsers({ params, searchParams }: InterestedUsersProps) {
  // Retrieve URL search params
  const urlParams = new URLSearchParams(searchParams)
  const interestedUsers = urlParams.get("interestedUsers")
  // console.log("INTERESTED USERS: ", interestedUsers)
  // console.log("PARAM: ", params)
  const interestedUsersArr = interestedUsers ? JSON.parse(interestedUsers) : []
  const interestedUsersObjArr: User[] = interestedUsersArr.map((user: string[]) => {
    return ({
      uid: user[0],
      name: user[1],
      teleHandle: user[2]
    })
  })

  return (
    <div id={interestStyles["interested-users-container"]}>
      <h1 style={{ color: "white", textAlign: "center" }}> Interested Users </h1>
      <div id={interestStyles["interested-users-list"]}>
        { interestedUsersObjArr.map((user: User) => (
          <UserEntry user={user} />
        ))}
      </div>
    </div>
  )
}

export default InterestedUsers
