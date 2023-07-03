import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import * as groupActions from '../../store/groups'
import { useEffect } from "react"
import { Link } from "react-router-dom"
import './GroupsDetails.css'


function GroupDetails() {
    const { id } = useParams()
    const dispatch1 = useDispatch()
   // const dispatch2 = useDispatch()
    const group = useSelector((state) => state.groups)


    useEffect(() => {
        dispatch1(groupActions.getDetailsById(id))
    }, [dispatch1, id])

    const obj = Object.values(group)
    if (obj.length >= 15) {

        console.log(group.Events)
    return (
        <div>
            <Link to='/groups'>{'<'} Groups</Link>
            <div className="groupDetails1">
            <div className="groupImage1">
            <img className='groupImg1' src={group.GroupImages[group.GroupImages.length - 1].url}></img>
            </div>
            <div className='groupInfo1'>
            <h2 className='groupTitle1'>{group.name}</h2>
            <p>{group.city}, {group.state}</p>
            <p> {group.Events.length} events - Public </p>
            <p>organized by {group.Organizer[0].firstName} and {group.Organizer[0].lastName}</p>
            <button>Join this group</button>
            </div>
            </div>
            <div className='details1'>
            <h2>Organizer</h2>
            <p>{group.Organizer[0].firstName} and {group.Organizer[0].lastName}</p>
            <h2>What we're about</h2>
            <p>{group.about}</p>
            </div>
            {group.Events ?
            <div className='event1'>
            <h2>Upcoming Events ({group.Events.length})</h2>
            {group.Events.map((event) =>
                <div className='eventBox1'>
                <img src={event.previewImage}></img>
                <h3>{event.name}</h3>
                <p>{event.Venue.city}, {event.Venue.state}</p>
                <p>{event.description}</p>
                </div>
            )}
            </div>
            : <div></div> }
        </div>
    )
    }
}

export default GroupDetails
