import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'
import './LoadingScreenTwo.css'

function LoadingScreenTwo({eventImg, groupImg}) {
    const groupDetails = useSelector((store) => store.groups)
    const eventDetails = useSelector((store) => store.events)
    const dispatch = useDispatch()

    console.log(eventImg, groupImg)
    console.log("hello?")

    let data
    if (eventImg.length || groupImg.length) {
        data = {
            url: eventImg || groupImg,
            preview: true
        }
    }

    const history = useHistory()

    console.log(eventDetails)

    setTimeout(() => {
        if (groupImg && groupImg.length) {
            history.push(`/groups/${groupDetails.id}`)
            dispatch(groupActions.addGroupImage(groupDetails.id, data))
        }
        else if (eventImg && eventImg.length) {
            history.push(`/events/${eventDetails.id}`)
            dispatch(eventActions.addEventImage(eventDetails.id, data))

        }
    }, 5000)

    return (
        <div class='backgroundLoad'>
            <img className='load' src='https://media3.giphy.com/media/UMCInx6yJdFwkR9jaN/giphy.gif?cid=ecf05e47yx5nr1hp3nljnpdkel437h9szzai7oz1p6aquct9&ep=v1_stickers_search&rid=giphy.gif&ct=s'></img>
            {groupImg && groupImg.length ? <p className='loadP'>Creating a new group...</p> : <p className='loadP'>Creating a new event...</p>}
        </div>
    )
}

export default LoadingScreenTwo
