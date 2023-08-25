import { useHistory } from "react-router-dom/"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import * as groupActions from '../../store/groups'
import * as eventActions from '../../store/events'
import './LoadingScreenTwo.css'

function LoadingScreenTwo({ event, group, updateG, updateE }) {
    const { singleGroup } = useSelector((state) => state.groups)
    const { singleEvent } = useSelector((state) => state.events)
    const dispatch = useDispatch()

    const history = useHistory()

    console.log(singleGroup)

    useEffect(() => {

        setTimeout(() => {
            if (group && group.length) {
                history.push(`/groups/${singleGroup.id}`)
            }
            else if (event && event.length) {
                history.push(`/events/${singleEvent.id}`)
            }
            else if (updateE && updateE.length) {
                history.push(`/events/${singleEvent.id}`)
            }
            else if (updateG && updateG.length) {
                history.push(`/groups/${singleGroup.id}`)
            }
        }, 5000)


        }, [singleGroup.id, singleEvent.id])


    return (
        <div className='backgroundLoad'>
            <img className='load' src='https://media3.giphy.com/media/UMCInx6yJdFwkR9jaN/giphy.gif?cid=ecf05e47yx5nr1hp3nljnpdkel437h9szzai7oz1p6aquct9&ep=v1_stickers_search&rid=giphy.gif&ct=s'></img>
            {updateG && updateG.length ? <p className='loadP'>Updating group...</p> : null}
            {updateE && updateE.length ? <p className='loadP'>Updating event...</p> : null}
            {group && group.length && !updateG ? <p className='loadP'>Creating a new group...</p> : null}
            {event && event.length && !updateG ?  <p className='loadP'>Creating a new event...</p> : null}
        </div>
    )
}

export default LoadingScreenTwo
