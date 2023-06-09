import * as eventActions from '../../store/events'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams, useHistory, Link} from 'react-router-dom';
import './EventDetails.css'
import LoadingScreen from '../LoadingScreen';
import DeleteEventModal from '../DeleteEventModal';
import { useModal } from "../../context/Modal";


function EventDetails() {
    const { id } = useParams()
    const history = useHistory()
    const dispatch = useDispatch();
    const details = useSelector((store) => store.events);
    const { setModalContent } = useModal();
    const { user } = useSelector((state) => state.session)


    useEffect(() => {
        dispatch(eventActions.getDetailsById(id))
    }, [dispatch, id])

    if (Object.values(details).length >= 13) {
        const group = details.Group
        console.log(group)
        let time

        return (
            <div>
            {group ?
                <div>
                <div className='intro4'>
                <div className='title3'>
                    <Link to='/events'>{'<'}Events</Link>
                <h2 className='eventTitle3'>{details.name}</h2>
                <p>Hosted by {group.Organizer ? group.Organizer[0].firstName : ""} {group.Organizer ? group.Organizer[0].lastName : ""}</p>
                 </div>
                </div>
                <div className='background2'>
                <div className='wholeEvent'>
                <div className='eventSections'>
                <div className='eventSec1'>
                <img className='eventImg2'src={details.EventImages.length ? details.EventImages[details.EventImages.length - 1].url : ""}></img>
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
                <p className='startDate3'><span>START</span>  {details.startDate.slice(0, 10)} · {time = new Date(details.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                <p className='endDate3'><span>END</span>   {details.endDate.slice(0, 10)} · {time = new Date(details.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                </div>
                </div>
                <div className='eventPrice2'>
                <div className='icon'>
                <i class="fa-solid fa-dollar-sign"></i>
                </div>
                <p className='price3'>{details.price === 0 ? "FREE" : details.price}</p>
                </div>
                <div className='eventType2'>
                <div>
                <i className="fa-solid fa-location-crosshairs"></i>
                </div>
                <p className='type3'>{details.type}</p>
                </div>
                </div>
                <div className='eventDeleteButton'>
                    {  user && user.id && user.id === group.organizerId ? <button onClick={(() => window.alert("feature coming soon"))}className='updateAnEvent'>Update</button> : null}
                    { user && user.id && user.id === group.organizerId ? <button className='deleteAnEvent' onClick={(() => setModalContent(<DeleteEventModal eventId={id} groupId={group.id}/>))}>Delete</button> : null}
                </div>
                </div>
                </div>
                </div>
                <div className='details3'>
                <h3 className='detailsTitle3'>Details</h3>
                <p className='eventDescription'>{details.description}</p>
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
