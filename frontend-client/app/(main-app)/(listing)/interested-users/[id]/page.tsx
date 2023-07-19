"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "react-bootstrap"
import interestStyles from "./interested-users.module.css"
import { useRouter } from "next/navigation"

type InterestedUsersProps = {
  params: { id: string } // listing UID
  searchParams: any
}

type User = {
  uid: string,
  name: string,
  teleHandle: string,
  profilePic: string
}

function NoProfilePic() {
  return <div className={interestStyles["no-profile-pic"]}></div>
}

function ProfilePic({ profilePic }: { profilePic: string }) {
  return (
    <>
      {profilePic ? (
        <div className={interestStyles["profile-pic"]}>
          <img style={{width: "50px", height: "50px"}} alt="" src={profilePic} />
        </div>
      ) : (
        <NoProfilePic />
      )}
    </>
  )
}

function UserEntry({ user, listingUID } : { user: User, listingUID: string }) {
  return (
    <div className={interestStyles["user-entry"]}>
      <div className={interestStyles["user-entry-left"]}>
        <ProfilePic profilePic={user.profilePic} />
        <Link className={interestStyles["user-link"]} href={`/view-profile/${user.uid}?listingUID=${listingUID}`}>
          <p className={interestStyles["user-name"]}>{user.name}</p>
        </Link>
      </div>
      <p className={interestStyles["user-tele"]}>{user.teleHandle}</p>
    </div>
  )
}

function InterestedUsers({ params, searchParams }: InterestedUsersProps) {
  const router = useRouter()
  // Retrieve URL search params
  const urlParams = new URLSearchParams(searchParams)
  const interestedUsers = urlParams.get("interestedUsers")
  const interestedUsersArr = interestedUsers ? JSON.parse(interestedUsers) : []
  const interestedUsersObjArr: User[] = interestedUsersArr.map((user: string[]) => {
    return ({
      uid: user[0],
      name: user[1],
      teleHandle: user[2],
      profilePic: user[3]
    })
  })

  return (
    <div id={interestStyles["interested-users-container"]}>
      <h1 style={{ color: "white", textAlign: "center" }}> Interested Users </h1>
      <div id={interestStyles["interested-users-list"]}>
        { interestedUsersObjArr.map((user: User) => (
          <UserEntry user={user} listingUID={params.id} />
        ))}
      </div>
      <Button variant="dark" onClick={() => router.back()}>Back</Button>
    </div>
  )
}

export default InterestedUsers
