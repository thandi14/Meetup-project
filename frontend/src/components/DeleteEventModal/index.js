import { useModal } from '../../context/Modal'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as eventActions from '../../store/events'
import "./DeleteEvent.css"

function DeleteEventModal({ eventId, groupId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory()
    const id = parseInt(eventId)

    const handleClick = () => {
        dispatch(eventActions.deleteEvent(id))
        closeModal()
        history.push(`/groups/${groupId}`)
    }

    return (
        <div className="deleteEvent2">
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>are you sure you want to remove this event?</p>
            <div className='deleteEventButton'>
            <button className='yesButton' onClick={handleClick}>Yes (Delete Event)</button>
            <button className='noButton' onClick={(() => closeModal())}>No (Keep Event)</button>
            </div>
        </div>
    )
}

export default DeleteEventModal
