import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import * as groupActions from '../../store/groups'
import { useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import './GroupsDetails.css'
import LoadingScreen from "../LoadingScreen"
import DeleteGroupModal from '../DeleteGroupModal'
import { useModal } from "../../context/Modal";




function GroupDetails() {
    const { id } = useParams()
    const dispatch1 = useDispatch()
    const history = useHistory()
    const group = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.session)
    const { setModalContent } = useModal();

    console.log(group)
    useEffect(() => {
        dispatch1(groupActions.getDetailsById(id))
    }, [dispatch1, id])

    const obj = Object.values(group)
    if (obj && obj.length >= 15) {

    return (
        <div>
            <div className="groupDetails1">
            <div className="groupImage1">
            <div className="linkArea">
            <Link className='allGroups' to='/groups'>{'<'} Groups</Link>
            </div>
            <img className='groupImg1' src={group.GroupImages && group.GroupImages.length ? group.GroupImages[group.GroupImages.length - 1].url : ''}></img>
            </div>
            <div className='groupInfo1'>
            <h2 className='groupTitle1'>{group.name}</h2>
            <div className="textBox">
            <p className='groupText1'> {group.city}, {group.state}</p>
            <p className='groupText1'> {group.Events && group.Events.length ? group.Events.length : 0} events - Public </p>
            <p className='groupText1'>organized by {group.Organizer[0].firstName} {group.Organizer[0].lastName}</p>
            </div>
            {user.id && user.id === group.organizerId ?
            <div className='userAction'>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${group.id}/events/new`))}>Create event</button>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${group.id}/edit`))}>Update</button>
                <button className='groupButton2' onClick={(() => setModalContent(<DeleteGroupModal groupId={id}/>))}>Delete</button>

            </div> :
            <button className="groupButton1">Join this group</button>
            }
            </div>
            </div>
            <div className='groupsBackground1'></div>
            <div className='groupsDetailsBox'>
            <div className='details1'>
            <h2 className='organizer'>Organizer</h2>
            <p className="firstLast">{group.Organizer[0].firstName} {group.Organizer[0].lastName}</p>
            <h2 className="aboutGroup">What we're about</h2>
            <p>{group.about}</p>
            </div>
            {group.Events ?
            <div className='event1'>
            <h2>Upcoming Events ({group.Events && group.Events.length ? group.Events.length : 0})</h2>
            {group.Events.map((event) =>
                <div className='eventBox1'>
                <div className='box1'>
                <div onClick={(() => history.push(`/events/${event.id}`))} className='eventImage1'>
                <img className='eventImg1'src={event.previewImage}></img>
                </div>
                <div className='eventDetails1'>
                <p onClick={(() => history.push(`/events/${event.id}`))} className='eventDate1'>{event.startDate.slice(0, 10)}</p>
                <h3 onClick={(() => history.push(`/events/${event.id}`))} className='eventName1'>{event.name}</h3>
                {event.Venue ? <p onClick={(() => history.push(`/events/${event.id}`))} className='eventLocation1'>{event.Venue.city}, {event.Venue.state}</p> : <p>n/a</p>}
                </div>
                </div>
                <p onClick={(() => history.push(`/events/${event.id}`))} className="eventDescription1">{event.description}</p>
                </div>
            )}
            </div>
            : <div></div> }
            </div>
        </div>
            // </div>
    )
    }
    else {
        return <LoadingScreen />
    }
}

export default GroupDetails
