import * as eventActions from '../../store/events'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams, useHistory, Link} from 'react-router-dom';
import './EventDetails.css'
import LoadingScreen from '../LoadingScreen';
import DeleteEventModal from '../DeleteEventModal';
import { useModal } from "../../context/Modal";

import * as groupActions from '../../store/groups'


function EventDetails() {
    const { id } = useParams()
    const history = useHistory()
    const dispatch = useDispatch();
    const { singleEvent, eventAttendances } = useSelector((state) => state.events);
    const { groupMembers } = useSelector((state) => state.groups);
    const { setModalContent } = useModal();
    const { user } = useSelector((state) => state.session)
    let attendances = Object.values(eventAttendances)
    const [ join, setJoin ] = useState(attendances.some((m) => m.userId === user.id))
    const [ unjoin, setUnjoin ] = useState(false)

    useEffect(() => {
        dispatch(eventActions.getDetailsById(id))
        if (join) dispatch(eventActions.createAttendance(id))
        if (unjoin) dispatch(eventActions.deleteAttendance(id, user.id))
        dispatch(groupActions.getAllMemberships(singleEvent.groupId))
        dispatch(eventActions.getAllAttendance(id))
    }, [dispatch, id, singleEvent.groupId, join, unjoin])

    let members = Object.values(groupMembers)

    const handleJoin = () => {
        if (join) {
          setUnjoin(true)
          setJoin(false)
          return
        }
        if (!join) {
          setJoin(true)
          setUnjoin(false)
          return
        }
      }

    if (Object.values(singleEvent).length) {
        const group = singleEvent.Group
        let time

        return (
            <div>
            {group ?
                <div>
                <div className='intro4'>
                <div className='title3'>
                    <Link to='/events'>{'<'}Events</Link>
                <h2 className='eventTitle3'>{singleEvent.name}</h2>
                <p>Hosted by {group.Organizer ? group.Organizer[0].firstName : ""} {group.Organizer ? group.Organizer[0].lastName : ""}</p>
                 </div>
                </div>
                <div className='background2'>
                <div className='wholeEvent'>
                <div className='eventSections'>
                <div className='eventSec1'>
                <img className='eventImg2'src={singleEvent.EventImages.length ? singleEvent.EventImages[singleEvent.EventImages.length - 1].url : ""}></img>
                </div>
                <div className='eventSec2'>
                <div className='eventGroup' onClick={(() => history.push(`/groups/${group.id}`))}>
                    <div className='groupImage3'>
                    <img onClick={(() => history.push(`/groups/${group.id}`))} className='groupImg3'src={group.GroupImages && group.GroupImages.length ? group.GroupImages[group.GroupImages.length - 1].url : ""}></img>
                    </div>
                    <div className='groupDetails3'>
                    <h3 onClick={(() => history.push(`/groups/${group.id}`))} className='groupName3'>{group.name}</h3>
                    {!group.private ? <p className='private3' onClick={(() => history.push(`/groups/${group.id}`))}>Public</p> : <p className='private3' onClick={(() => history.push(`/groups/${group.id}`))}>Private</p>}
                    </div>
                </div>
                <div className='eventDetails2'>
                <div className='infoForEvents'>
                <div className='eventTimes'>
                <div className='icon'>
                <i class="fa-regular fa-clock"></i>
                 </div>
                <div className='times'>
                <p className='startDate3'><span>START</span>  {singleEvent.startDate.slice(0, 10)} · {time = new Date(singleEvent.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                <p className='endDate3'><span>END</span>   {singleEvent.endDate.slice(0, 10)} · {time = new Date(singleEvent.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                </div>
                </div>
                <div className='eventPrice2'>
                <div className='icon'>
                <i class="fa-solid fa-dollar-sign"></i>
                </div>
                <p className='price3'>{singleEvent.price === 0 ? "FREE" : singleEvent.price}</p>
                </div>
                <div className='eventType2'>
                <div>
                <i className="fa-solid fa-location-crosshairs"></i>
                </div>
                <p className='type3'>{singleEvent.type}</p>
                </div>
                </div>
                <div className='eventDeleteButton'>
                    {  user && user.id && user.id === group.organizerId ? <button onClick={(() => history.push(`/events/${id}/edit`))}className='updateAnEvent'>Update</button> : null}
                    {  user && user.id && members.some((m) => m.userId === user.id && m.status === "member") && user.id !== group.organizerId && attendances.some((m) => m.userId === user.id && m.status !== "attending") ? <button onClick={handleJoin} className='updateAnEvent2'>{ attendances.some((m) => m.userId === user.id) ? "Pending" : "Attend"} </button> : null}
                    {  user && user.id && members.some((m) => m.userId === user.id && m.status === "member") && user.id !== group.organizerId && attendances.some((m) => m.status === "attending") ? <button onClick={handleJoin} className='updateAnEvent2'>Unattend</button> : null}
                    { user && user.id && user.id === group.organizerId ? <button className='deleteAnEvent' onClick={(() => setModalContent(<DeleteEventModal eventId={id} groupId={group.id}/>))}>Delete</button> : null}
                </div>
                </div>
                </div>
                </div>
                <div className='details3'>
                <h3 className='detailsTitle3'>Details</h3>
                <p className='eventDescription'>{singleEvent.description}</p>
                </div>
                </div>
                </div>
                </div>
                    : <LoadingScreen /> }
            </div>
        )
    }
    else {
        return <LoadingScreen />
    }
}

export default EventDetails
