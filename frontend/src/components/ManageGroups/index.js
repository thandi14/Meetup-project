import * as groupActions from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import '../Groups/Groups.css'
import LoadingScreen from '../LoadingScreen'
import DeleteGroupModal from '../DeleteGroupModal'
import { useModal } from '../../context/Modal'

function ManageGroups() {
    const dispatch1 = useDispatch()
    const history = useHistory()
    let { userGroups } = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.session)
    const { setModalContent } = useModal();
    const [ groupId, setGroupId ] = useState(null)
    const [ index, setIndex ] = useState(null)

    console.log(userGroups)

    useEffect(() => {
         dispatch1(groupActions.getAllUserGroups())
        if (groupId) dispatch1(groupActions.deleteMembership(groupId, user.id))

    }, [dispatch1, groupId])


    if (Object.values(userGroups).length) {
       let eachG = Object.values(userGroups)




    return (
        <div className='groupsPage'>
        <div className='links'>
        <NavLink className='groupLink4' to='/groups/current'>Manage Groups</NavLink>
        </div>
        <div className='title'>
        <h2>Your groups in Meetus</h2>
        </div>
        <div className='allGroups'>
            {eachG.length ? eachG.map((g, i) =>
            <>
            <div className='divider'></div>
            <div className='groups'>
                <div  className='img'>
                <img onClick={(() => history.push(`/groups/${g.id}`))} className='groupImg' src={g.previewImage}></img>
                </div>
                <div className='info2'>
                <h2 onClick={(() => history.push(`/groups/${g.id}`))} className='groupTitle'>{g.name}</h2>
                <p onClick={(() => history.push(`/groups/${g.id}`))} className='location'>{g.city}, {g.state}</p>
                <div className='aboutSection'>
                <p onClick={(() => history.push(`/groups/${g.id}`))} className='about'>{g.about}</p>
                </div>
                {user && user.id && user.id === g.organizerId ?
                <div id="manage-butts"><button onClick={(() => history.push(`/groups/${g.id}/edit`))}>Update</button><button onClick={(() => setModalContent(<DeleteGroupModal groupId={g.id}></DeleteGroupModal>) )}>Delete</button></div> : <button onClick={(() => {
                    setGroupId(g.id)
                    })} id="joined">Unjoin</button>}
                <div className='private'> #{g.Events && g.Events.length ? g.Events.length : 0} events · {g.private ? "Private" : "Public"}</div>
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

export default ManageGroups
