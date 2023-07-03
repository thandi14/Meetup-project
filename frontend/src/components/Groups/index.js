import * as groupActions from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import './Groups.css'

function Groups() {
    const dispatch1 = useDispatch()
    const dispatch2 = useDispatch()
    const history = useHistory()
    const groups = useSelector((state) => state.groups)

    useEffect(() => {
        dispatch1(groupActions.getAllGroups())
    }, [dispatch1])

    const eachG = Object.values(groups)


    

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
                <img className='groupImg' src={g.previewImage}></img>
                </div>
                <div className='info'>
                <h2 className='groupTitle'>{g.name}</h2>
                <p className='location'>{g.city}, {g.state}</p>
                <p className='about'>{g.about}</p>
                <div className='private'> ## events - {g.private ? "Public" : "Private"}</div>
                </div>
            </div>
            </>
            )}
        </div>
        </div>


    )
}

export default Groups
