"use client"

import Link from "next/link"
import { Button, Spinner } from "react-bootstrap"
import interestStyles from "./interested-users.module.css"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

function ReportButton(
  { listingUID, creatorName, creatorUID } : 
  { listingUID: string, creatorName: string, creatorUID: string }) {
  const router = useRouter()
  return (
    <Button 
      variant="danger" 
      onClick={() => 
        router.push(`/report-user?name=${creatorName}&userID=${creatorUID}&listingUID=${listingUID}`)}
    >Report Owner</Button>
  )
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

function InterestedUsersList({ interestedUsers, listingUID } : { interestedUsers: User[], listingUID: string}) {
  return (
    <>
      { interestedUsers.length == 0
        ? <></>
        : <div id={interestStyles["interested-users-list"]}>
            { interestedUsers.map((user: User) => (
              <UserEntry key={user.uid} user={user} listingUID={listingUID} />
            )) }
          </div>
      }
    </>
  )
}

function InterestedUsers({ params, searchParams }: InterestedUsersProps) {
  const router = useRouter()
  // Retrieve URL search params
  const urlParams = useSearchParams()
  const [ interestedUsers, setInterestedUsers ] = useState<User[]>([])
  const [ isLoading, setIsLoading ] = useState<boolean>(true)

  useEffect(() => {
    async function fetchInterestedUsers() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/get-interested-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({listingUID: params.id}),
        }
      )
    
      if (!response.ok) {
        console.log(response.status)
        setIsLoading(false)
        throw new Error("Failed to fetch interested users")
      }
    
      const interestedUsers = await response.json()
      setInterestedUsers(interestedUsers)
      setIsLoading(false)
    }
    fetchInterestedUsers().catch(error => console.log(error))
  }, [])

  if (isLoading) {
    return (
      <div id={interestStyles["interested-users-container"]}>
        <h1 style={{ color: "white", textAlign: "center" }}>Interested Users</h1>
        <div id={interestStyles["loading-container"]}>
          <Spinner
            as="span"
            variant="light"
            animation="border"
            role="status"
            size="sm"
            aria-hidden="true"
            style={{marginRight: "10px"}}
          />
          <h5 style={{ color: "white", marginTop: "0px", marginBottom: "0px" }}>Fetching Interested Users...</h5>
        </div>
        <Button variant="dark" onClick={() => router.back()}>Back</Button>
      </div>
    )
  }

  return (
    <div id={interestStyles["interested-users-container"]}>
      <h1 style={{ color: "white", textAlign: "center" }}>Interested Users</h1>
      <ReportButton 
        listingUID={params.id} 
        creatorName={urlParams.get("creatorName") || ""}
        creatorUID={urlParams.get("creatorUID") || ""} 
      />
      <InterestedUsersList interestedUsers={interestedUsers} listingUID={params.id} />
      <Button variant="dark" onClick={() => router.back()}>Back</Button>
    </div>
  )
}

export default InterestedUsers
