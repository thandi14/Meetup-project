import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'
import './LoadingScreenTwo.css'

function LoadingScreenTwo({ event, group }) {
    const groupDetails = useSelector((store) => store.groups)
    const eventDetails = useSelector((store) => store.events)
    const dispatch = useDispatch()

    console.log(event, group)

    const history = useHistory()

    console.log(eventDetails)

    setTimeout(() => {

        if (group && group.length) {
            history.push(`/groups/${groupDetails.id}`)
        }
        else if (event && event.length) {
            history.push(`/events/${eventDetails.id}`)
        }
    }, 5000)

    return (
        <div className='backgroundLoad'>
            <img className='load' src='https://media3.giphy.com/media/UMCInx6yJdFwkR9jaN/giphy.gif?cid=ecf05e47yx5nr1hp3nljnpdkel437h9szzai7oz1p6aquct9&ep=v1_stickers_search&rid=giphy.gif&ct=s'></img>
            {group && group.length ? <p className='loadP'>Creating a new group...</p> : <p className='loadP'>Creating a new event...</p>}
        </div>
    )
}

export default LoadingScreenTwo
