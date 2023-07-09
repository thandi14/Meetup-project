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

        let time

        let currTime = new Date()

        let upComingDates = group.Events.filter((e) => new Date(e.startDate) > currTime)

        let upComing = upComingDates.sort((a, b) => {

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
        let pastDates = group.Events.filter((e) => new Date(e.startDate) < currTime)
        let past = pastDates.sort((a, b) => {

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
            <p className='groupText1'> {group.Events && group.Events.length ? group.Events.length : 0} events · {group.private ? "Private" : "Public"} </p>
            <p className='groupText1'>Organized by {group.Organizer[0].firstName} {group.Organizer[0].lastName}</p>
            </div>
            </div>
            {user && user.id && user.id === group.organizerId ?
            <div className='userAction'>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${group.id}/events/new`))}>Create event</button>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${group.id}/edit`))}>Update</button>
                <button className='groupButton2' onClick={(() => setModalContent(<DeleteGroupModal groupId={id}></DeleteGroupModal>))}>Delete</button>

            </div> : null}
            {user && user.id && user.id !== group.organizerId ? <button className="groupButton1" onClick={(() => window.alert("feature coming soon"))} >Join this group</button> : null}
            </div>
            <div className='groupsBackground1'>
            <div className='groupsDetailsBox'>
            <div className='details1'>
            <h2 className='organizer'>Organizer</h2>
            <p className="firstLast">{group.Organizer[0].firstName} {group.Organizer[0].lastName}</p>
            <h2 className="aboutGroup">What we're about</h2>
            <p className='aboutText'>{group.about}</p>
            </div>
            {upComing && upComing.length ?
            <div className='event1'>
                <h2 className='upcoming'>Upcoming Events ({upComing && upComing.length ? upComing.length : 0})</h2>
            {upComing.map((event) =>
            <>
                <div className='eventBox1'onClick={(() => history.push(`/events/${event.id}`))} >
                <div className='box1'>
                <div onClick={(() => history.push(`/events/${event.id}`))} className='eventImage1'>
                <img className='eventImg1'src={event.previewImage}></img>
                </div>
                <div className='eventDetails1'>
                <p onClick={(() => history.push(`/events/${event.id}`))} className='eventDate1'>{event.startDate.slice(0, 10)} · {time = new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                <h3 onClick={(() => history.push(`/events/${event.id}`))} className='eventName1'>{event.name}</h3>
                {event.Venue ? <p onClick={(() => history.push(`/events/${event.id}`))} className='eventLocation1'>{event.Venue.city}, {event.Venue.state}</p> : <p>n/a</p>}
                </div>
                </div>
                <p onClick={(() => history.push(`/events/${event.id}`))} className="eventDescription1">{event.description}</p>
                </div>
                </>
            )}
            </div>
            : <div></div> }
            {past && past.length ?
            <div className='event1'>
                <h2 className='past' >Past Events ({past && past.length ? past.length : 0})</h2>
            {past.map((event) =>
            <>
                <div className='eventBox1' onClick={(() => history.push(`/events/${event.id}`))}>
                <div className='box1'>
                <div onClick={(() => history.push(`/events/${event.id}`))} className='eventImage1'>
                <img className='eventImg1'src={event.previewImage}></img>
                </div>
                <div className='eventDetails1'>
                <p onClick={(() => history.push(`/events/${event.id}`))} className='eventDate1'>{event.startDate.slice(0, 10)} · {time = new Date(event.startDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric"})}</p>
                <h3 onClick={(() => history.push(`/events/${event.id}`))} className='eventName1'>{event.name}</h3>
                {event.Venue ? <p onClick={(() => history.push(`/events/${event.id}`))} className='eventLocation1'>{event.Venue.city}, {event.Venue.state}</p> : <p>n/a</p>}
                </div>
                </div>
                <p onClick={(() => history.push(`/events/${event.id}`))} className="eventDescription1">{event.description}</p>
                </div>
                </>
            )}
            </div>
            : <div></div> }
            {!past.length && !upComing.length && <h2 className='upcoming'>No upcoming events</h2>}
           </div>
          </div>
        </div>
    )
    }
    else {
        return <LoadingScreen />
    }
}

export default GroupDetails
