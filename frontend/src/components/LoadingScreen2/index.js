import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'

function LoadingScreenTwo({ imgUrl }) {
    const groupDetails = useSelector((store) => store.groups)
    const eventDetails = useSelector((store) => store.events)
    const dispatch = useDispatch()

    let data
    if (imgUrl) {
        data = {
            url: imgUrl,
            preview: true
        }
    }

    const history = useHistory()

    console.log(eventDetails)

    setTimeout(() => {
        if (groupDetails.id && !eventDetails.id) {
            history.push(`/groups/${groupDetails.id}`)
            dispatch(groupActions.addGroupImage(groupDetails.id, data))
        }
        if (eventDetails.id) {
            history.push(`/events/${eventDetails.id}`)
            dispatch(eventActions.addEventImage(eventDetails.id, data))

        }
    }, 5000)

    return (
        <div>Loading</div>
    )
}

export default LoadingScreenTwo
