import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useHistory } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutUser()).then(history.push('/'));
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <ul className={ulClassName} ref={ulRef}>
      {user ? (
          <div className='dropdown'>
            <p>{user.username}</p>
            <p>{user.firstName} {user.lastName}</p>
            <p>{user.email}</p>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </div>
        ) : null
        }
      </ul>
      <div className='profileButton' onClick={openMenu}>
        <i className="fa-regular fa-user"></i>
      </div>
      </>
  );
}

export default ProfileButton;
