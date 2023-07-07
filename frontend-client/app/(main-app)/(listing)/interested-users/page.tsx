import { useRouter } from "next/navigation"
import { ListGroup, ListGroupItem } from "react-bootstrap"

function InterestedUsersPage() {
    const router = useRouter()
    const { interestedUsers } = router.query

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