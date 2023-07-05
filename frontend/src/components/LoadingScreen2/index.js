import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"

function LoadingScreenTwo() {
    const groupDetails = useSelector((store) => store.groups)
    const eventDetails = useSelector((store) => store.events)
    const dispatch = useDispatch()

    const history = useHistory()

    console.log(eventDetails)

    setTimeout(() => {
        if (groupDetails.id) {
              history.push(`/groups/${groupDetails.id}`)
        }
        if (eventDetails.id) {
            history.push(`/events/${eventDetails.id}`)
        }
    }, 5000)

    return (
        <div>Loading</div>
    )
}

export default LoadingScreenTwo
