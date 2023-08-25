import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as eventActions from '../../store/events'
import '../Events/Events.css'
import LoadingScreen from '../LoadingScreen'
import { useModal } from '../../context/Modal'
import DeleteEventModal from '../DeleteEventModal'

function ManageEvents() {
    const dispatch1 = useDispatch()
    const history = useHistory()
    let { userEvents } = useSelector((state) => state.events)
    const { user } = useSelector((state) => state.session)
    const { setModalContent } = useModal();
    const [ eventId, setEventId ] = useState(null)



    useEffect(() => {
        dispatch1(eventActions.getAllUserEvents())
        if (eventId) dispatch1(eventActions.deleteAttendance(eventId))
    }, [dispatch1, eventId])

    let eachE

    if (Object.values(userEvents).length) {
        eachE = Object.values(userEvents)
        // eachE = eachE.filter((e) => )
    }
    console.log(eachE)

    let currTime = new Date()
    let past
    let upComing
    if ( eachE && eachE.length) {
        let upComingDates = eachE.filter((e) => new Date(e.startDate) > currTime)
             upComing = upComingDates.sort((a, b) => {

            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);

            if (dateA > dateB) {
              return 1; // dateA comes before dateB
            } else if (dateA < dateB) {
              return -1; // dateA comes after dateB
            } else {
              return 0; // dateA and dateB are equal
            }

        })

        let pastDates = eachE.filter((e) => new Date(e.startDate) < currTime)
             past = pastDates.sort((a, b) => {

            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);

            if (dateA > dateB) {
              return -1; // dateA comes before dateB
            } else if (dateA < dateB) {
              return 1; // dateA comes after dateB
            } else {
              return 0; // dateA and dateB are equal
            }

        })

    }


    if ( eachE && eachE.length) {
        let time
        let eachEve = upComing.concat(past)


    return (
        <div className='eventsPage'>
        <div className='links'>
        <NavLink className='groupLink4' to='/events/current'>Manage Events</NavLink>
        </div>
        <div className='title'>
        <h2>Your events in Meetus</h2>
        </div>
        <div className='allEvents'>

            {eachEve.map((e) =>
            <div id="manageE">
            <div className='divider'></div>
            <div className='events'>
                <div className='img2'>
                <img onClick={(() => history.push(`/events/${e.id}`))} className='eventImg' src={e.EventImages[0].url}></img>
                </div>
                <div className='info2'>
                {e.startDate ?
                <p className='eventDate'>{e.startDate.slice(0, 10)} · {time = new Date(e.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}</p>
                : <p></p>}
                <h2 onClick={(() => history.push(`/events/${e.id}`))} className='eventTitle'>{e.name}</h2>
                {e.Venue ?
                <p onClick={(() => history.push(`/events/${e.id}`))} className='location2'>{e.Venue.city}, {e.Venue.state}</p>
                : <p></p>}
                </div>
            </div>
            {user && user.id && user.id === e.Group.organizerId ?
                <div id="manage-butts"><button onClick={(() => history.push(`/events/${e.id}/edit`))}>Update</button><button onClick={(() => setModalContent(<DeleteEventModal eventId={e.id} groupId={e.groupId}></DeleteEventModal>) )}>Delete</button></div> : <button onClick={(() => {
                    setEventId(e.id)
                    })} id="joined">Unattend</button>}
            <p onClick={(() => history.push(`/events/${e.id}`))} className='description'>{e.description}</p>
            </div>
            )}
        </div>
        </div>


    )
    }
    else {
        return <LoadingScreen />
    }
}

export default ManageEvents
