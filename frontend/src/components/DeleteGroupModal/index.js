import { useModal } from '../../context/Modal'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as groupActions from '../../store/groups'
import './DeleteGroup.css'
import { useState, useEffect } from 'react';
import LoadingScreen from '../LoadingScreen';

function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory()
    const id = parseInt(groupId)

    const handleClick = () => {
        dispatch(groupActions.deleteGroup(id))
        closeModal()
        setIsLoading(true)

        setTimeout(() => {
            history.push('/groups')
        }, 3000)
    }

    return (
        <>
        {!isLoading ?
        <div className="deleteGroup">
            <h1 className='deleteTitle'>Confirm Delete</h1>
            <p className='deleteText'>Are you sure you want to remove this group?</p>
            <div className='deleteGroupButton'>
            <button className='yesButton' onClick={handleClick}>Yes (Delete Group)</button>
            <button className='noButton' onClick={(() => closeModal())}>No (Keep Group)</button>
            </div>
        </div> :
        <LoadingScreen />}
        </>
    )
}

export default DeleteGroupModal
