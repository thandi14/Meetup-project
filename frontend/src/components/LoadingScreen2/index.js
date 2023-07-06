import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'
import './LoadingScreenTwo.css'

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
        <div class='backgroundLoad'>
            <img className='load' src='https://media3.giphy.com/media/UMCInx6yJdFwkR9jaN/giphy.gif?cid=ecf05e47yx5nr1hp3nljnpdkel437h9szzai7oz1p6aquct9&ep=v1_stickers_search&rid=giphy.gif&ct=s'></img>
            {groupDetails.id && !eventDetails.id ? <p className='loadP'>Creating a new group...</p> : <p className='loadP'>Creating a new event...</p>}
        </div>
    )
}

export default LoadingScreenTwo
