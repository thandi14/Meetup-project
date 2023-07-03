import { useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import * as groupActions from '../../store/groups'
import { useEffect } from "react"
import { Link } from "react-router-dom"


function GroupDetails() {
    const { id } = useParams()
    const dispatch1 = useDispatch()
   // const dispatch2 = useDispatch()
    const group = useSelector((state) => state.groups)

    useEffect(() => {
        dispatch1(groupActions.getDetailsById(id))
    }, [dispatch1, id])

    const imgs = group.GroupImages
    //console.log(group)

    return (
        <div>
            <Link to='/groups'>{'<'} Groups</Link>
            {/* <img src={group && group.GroupImages[group.GroupImages.length - 1].url}></img> */}
            <h1>{group.name}</h1>
            <p>{group.city}, {group.state}</p>
            <p> ## events - Public </p>
            <p>organized by fistname and lastname</p>
            <button>Join this group</button>
            <h2>Organizer</h2>
            <p>firstname and lastname</p>
            <h2>What we're about</h2>
            <p>{group.about}</p>
            <h2>Upcoming Events (#)</h2>
            <img></img>
            <h3>Event title</h3>
            <p>location</p>
            <p>discription</p>
        </div>
    )
}

export default GroupDetails
