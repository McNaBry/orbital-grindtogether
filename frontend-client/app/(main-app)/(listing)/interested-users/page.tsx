import { useRouter } from "next/router"
import { ListGroup, ListGroupItem } from "react-bootstrap"

function InterestedUsersPage() {
    const router = useRouter()
    const { interestedUsers } = router.query
    console.log(interestedUsers)
    const interestedUsersArr = interestedUsers ? JSON.parse(interestedUsers) : []

   return (
    <div>
        <h1> Interested Users Page </h1>
        <ListGroup>
            {interestedUsersArr.map((user: string) => (
                <ListGroupItem > {user} </ListGroupItem>
            ))}
        </ListGroup>
    </div>
   )
}

export default InterestedUsersPage;