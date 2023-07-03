import * as groupActions from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Groups.css'

function Groups() {
    const dispatch = useDispatch()
    const groups = useSelector((state) => state.groups)

    useEffect(() => {
        dispatch(groupActions.getAllGroups())
    }, [dispatch])



    const eachG = Object.values(groups)

   console.log(eachG)



    return (
        <div className='groupsPage'>
        <div className='links'>
        <NavLink to='/groups'>Groups</NavLink>
        <NavLink to='/events'>Events</NavLink>
        </div>
        <div>
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
                <div> ## events - {g.private ? "Public" : "Private"}</div>
                </div>
            </div>
            </>
            )}
        </div>
        </div>


    )
}

export default Groups
