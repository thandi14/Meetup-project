import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as eventActions from '../../store/events'
import './Events.css'
import LoadingScreen from '../LoadingScreen'

function Events() {
    const dispatch1 = useDispatch()
    const history = useHistory()
    let events = useSelector((state) => state.events)


    useEffect(() => {
        dispatch1(eventActions.getAllEvents())
    }, [dispatch1])

    let eachE

    if (events.Events) {
        eachE = Object.values(events.Events)
    }

    let currTime = new Date()
    let past
    let upComing
    if (eachE) {
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


    if (eachE) {
        let time
        let eachEve = upComing.concat(past)


    return (
        <div className='eventsPage'>
        <div className='links'>
        <NavLink className='eventLink3' to='/events'>Events</NavLink>
        <NavLink className='groupLink3' to='/groups'>Groups</NavLink>
        </div>
        <div className='title'>
        <h2>Events in Meetus</h2>
        </div>
        <div className='allEvents'>

            {eachEve.map((e) =>
            <>
            <div className='divider'></div>
            <div className='events'>
                <div className='img2'>
                <img onClick={(() => history.push(`/events/${e.id}`))} className='eventImg' src={e.previewImage}></img>
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
                <p onClick={(() => history.push(`/events/${e.id}`))} className='description'>{e.description}</p>
            </>
            )}
        </div>
        </div>


    )
    }
    else {
        return <LoadingScreen />
    }
}

export default Events
