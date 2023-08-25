import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import * as groupActions from '../../store/groups'
import { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import './GroupsDetails.css'
import LoadingScreen from "../LoadingScreen"
import DeleteGroupModal from '../DeleteGroupModal'
import { useModal } from "../../context/Modal";


function GroupDetails() {
    const { id } = useParams()
    const dispatch1 = useDispatch()
    const history = useHistory()
    const { singleGroup, groupMembers } = useSelector((state) => state.groups)
    const { user } = useSelector((state) => state.session)
    const { setModalContent } = useModal();
    let members = Object.values(groupMembers)
    const [ join, setJoin ] = useState(members.some((m) => m.userId === user?.id))
    const [ unjoin, setUnjoin ] = useState(false)

    useEffect(() => {
      dispatch1(groupActions.getDetailsById(id))
      if (join) dispatch1(groupActions.createMembership(id))
      if (unjoin) dispatch1(groupActions.deleteMembership(id, user.id))

      dispatch1(groupActions.getAllMemberships(id))

    }, [dispatch1, id, join, unjoin, user?.id])


    console.log(singleGroup.Organizer?.filter((g) => g.id === singleGroup.organizerId))

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

    if (Object.values(singleGroup).length) {

        let time

        let currTime = new Date()

        let upComingDates = singleGroup.Events?.filter((e) => new Date(e.startDate) > currTime)

        let upComing = upComingDates?.sort((a, b) => {

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
        let pastDates = singleGroup.Events?.filter((e) => new Date(e.startDate) < currTime)
        let past = pastDates?.sort((a, b) => {

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
            <img className='groupImg1' src={singleGroup.GroupImages && singleGroup.GroupImages.length ? singleGroup.GroupImages[singleGroup.GroupImages.length - 1].url : ''}></img>
            </div>
            <div className='groupInfo1'>
            <h2 className='groupTitle1'>{singleGroup.name}</h2>
            <div className="textBox">
            <p className='groupText1'> {singleGroup.city}, {singleGroup.state}</p>
            <p className='groupText1'> {singleGroup.Events && singleGroup.Events.length ? singleGroup.Events.length : 0} events · {singleGroup.private ? "Private" : "Public"} </p>
            <p className='groupText1'>Organized by {singleGroup.Organizer ? singleGroup.Organizer?.filter((g) => g.id === singleGroup.organizerId)[0]?.firstName : ""} {singleGroup.Organizer ? singleGroup.Organizer?.filter((g) => g.id === singleGroup.organizerId)[0]?.lastName : ""}</p>
            </div>
            </div>
            {user && user.id && user.id === singleGroup.organizerId ?
            <div className='userAction'>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${singleGroup.id}/events/new`))}>Create event</button>
                <button className='groupButton2' onClick={(() => history.push(`/groups/${singleGroup.id}/edit`))}>Update</button>
                <button className='groupButton2' onClick={(() => setModalContent(<DeleteGroupModal groupId={id}></DeleteGroupModal>))}>Delete</button>

            </div> :
             !members.some((m) => m.userId === user.id) && !members.some((m) => m.status === "member") ? <button onClick={handleJoin} className="groupButton1" >{ members.some((m) => m.userId === user.id && m.status === "pending") ? "Pending" : "Join this group"}</button> : <button onClick={handleJoin} className="groupButton3">Unjoin</button>
            }
            </div>
            <div className='groupsBackground1'>
            <div className='groupsDetailsBox'>
            <div className='details1'>
            <h2 className='organizer'>Organizer</h2>
            <p className="firstLast">{singleGroup.Organizer.length ? singleGroup.Organizer[0].firstName : ""} {singleGroup.Organizer.length ? singleGroup.Organizer[0].lastName : ""}</p>
            <h2 className="aboutGroup">What we're about</h2>
            <p className='aboutText'>{singleGroup.about}</p>
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
            {!past?.length && !upComing?.length && <h2 className='upcoming'>No upcoming events</h2>}
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
