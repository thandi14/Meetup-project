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

    let eachE = Object.values(events)
    console.log(eachE)

    if (eachE) {
        eachE = eachE.filter((e) => typeof e === 'object')
        eachE = eachE.filter((e) => e.venueId)

    return (
        <div className='eventsPage'>
        <div className='links'>
        <NavLink className='eventLink3' to='/events'>Events</NavLink>
        <NavLink className='groupLink3' to='/groups'>Groups</NavLink>
        </div>
        <div className='title'>
        <h2>Events in Meetup</h2>
        </div>
        <div className='allEvents'>
            {eachE.map((e) =>
            <>
            <div className='divider'></div>
            <div className='events'>
                <div className='img2'>
                <img onClick={(() => history.push(`/events/${e.id}`))} className='eventImg' src={e.previewImage}></img>
                </div>
                <div className='info2'>
                {e.startDate ?
                <p className='eventDate'>{e.startDate.slice(0, 10)} {e.startDate.slice(10, e.startDate.length)}</p>
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
