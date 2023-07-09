import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'
import './LoadingScreenTwo.css'

function LoadingScreenTwo({ event, group, updateG }) {
    const groupDetails = useSelector((store) => store.groups)
    const eventDetails = useSelector((store) => store.events)
    const dispatch = useDispatch()

    const history = useHistory()

    setTimeout(() => {

        if (group && group.length) {
            history.push(`/groups/${groupDetails.id}`)
        }
        else if (event && event.length) {
            history.push(`/events/${eventDetails.id}`)
        }
        else if (updateG && updateG.length) {
            history.push(`/groups/${groupDetails.id}`)
        }
    }, 5000)

    return (
        <div className='backgroundLoad'>
            <img className='load' src='https://media3.giphy.com/media/UMCInx6yJdFwkR9jaN/giphy.gif?cid=ecf05e47yx5nr1hp3nljnpdkel437h9szzai7oz1p6aquct9&ep=v1_stickers_search&rid=giphy.gif&ct=s'></img>
            {updateG && updateG.length ? <p className='loadP'>Updating group...</p> : null}
            {group && group.length && !updateG ? <p className='loadP'>Creating a new group...</p> : null}
            {event && event.length && !updateG ?  <p className='loadP'>Creating a new event...</p> : null}
        </div>
    )
}

export default LoadingScreenTwo
