import { useModal } from '../../context/Modal'
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups'
import './DeleteGroup.css'
import LoadingScreen from '../LoadingScreen';

function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory()
    const id = parseInt(groupId)

    const handleClick = () => {
        dispatch(groupActions.deleteGroup(id))
        closeModal()
        return <LoadingScreen deleteGroup="group"/>
    }

    return (
        <div className="deleteGroup">
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>Are you sure you want to remove this group?</p>
            <div className='deleteGroupButton'>
            <button className='yesButton' onClick={handleClick}>Yes (Delete Group)</button>
            <button className='noButton' onClick={(() => closeModal())}>No (Keep Group)</button>
            </div>
        </div>
    )
}

export default DeleteGroupModal
