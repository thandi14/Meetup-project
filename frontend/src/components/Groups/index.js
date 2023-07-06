import * as groupActions from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import './Groups.css'
import LoadingScreen from '../LoadingScreen'

function Groups() {
    const dispatch1 = useDispatch()
    const history = useHistory()
    let groups = useSelector((state) => state.groups)


    useEffect(() => {
        dispatch1(groupActions.getAllGroups())
    }, [dispatch1])


    let eachE
    if (groups.Groups) {

        let eachG = Object.values(groups.Groups)
        eachE = groups.Groups.Events

        eachG.pop()

    return (
        <div className='groupsPage'>
        <div className='links'>
        <NavLink className='eventLink2' to='/events'>Events</NavLink>
        <NavLink className='groupLink2' to='/groups'>Groups</NavLink>
        </div>
        <div className='title'>
        <h2>Groups in Meetus</h2>
        </div>
        <div className='allGroups'>
            {eachG.length ? eachG.map((g) =>
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
                <div onClick={(() => history.push(`/groups/${g.id}`))} className='private'> #{eachE && eachE.length ? eachE.filter((e) => e.groupId === g.id).length : 0} events · {g.private ? "Public" : "Private"}</div>
                </div>
            </div>
            </>
            ) : null}
        </div>
        </div>


    )
    }
    else {
        return <LoadingScreen />
    }
}

export default Groups
