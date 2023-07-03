import * as groupActions from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import * as eventActions from '../../store/events'
import './Groups.css'

function Groups() {
    const dispatch1 = useDispatch()
    const dispatch2 = useDispatch()
    const history = useHistory()
    const { groups, events } = useSelector((state) => state)

    useEffect(() => {
        dispatch2(eventActions.getAllEvents()).then(() => {
            dispatch1(groupActions.getAllGroups())
        })
    }, [dispatch2, dispatch1])

    const eachG = Object.values(groups)

    const eachE = Object.values(events)

    return (
        <div className='groupsPage'>
        <div className='links'>
        <NavLink className='eventLink' to='/events'>Events</NavLink>
        <NavLink className='groupLink' to='/groups'>Groups</NavLink>
        </div>
        <div className='title'>
        <h2>Groups in Meetup</h2>
        </div>
        <div className='allGroups'>
            {eachG.map((g) =>
            <>
            <div className='divider'></div>
            <div className='groups'>
                <div className='img'>
                <img onClick={(() => history.push(`/groups/${g.id}`))} className='groupImg' src={g.previewImage}></img>
                </div>
                <div className='info'>
                <h2 onClick={(() => history.push(`/groups/${g.id}`))} className='groupTitle'>{g.name}</h2>
                <p onClick={(() => history.push(`/groups/${g.id}`))} className='location'>{g.city}, {g.state}</p>
                <p onClick={(() => history.push(`/groups/${g.id}`))} className='about'>{g.about}</p>
                <div onClick={(() => history.push(`/groups/${g.id}`))} className='private'> {eachE.filter((e) => e.groupId === g.id).length} events - {g.private ? "Public" : "Private"}</div>
                </div>
            </div>
            </>
            )}
        </div>
        </div>


    )
}

export default Groups
