import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useHistory } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import MenuModal from "./menu";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [button, setButton] = useState(false)
  const ulRef = useRef();
  const history = useHistory()

  const closeMenu = () => setShowMenu(false);


  const openMenu = () => {
    if (!button) {
      setButton(true)
    }
    else if (button) {
      setButton(false)
    }
    if (showMenu) closeMenu();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logoutUser()).then(history.push('/'));
  };

  const ulClassName = showMenu ? "profile-dropdown" : " hidden";

  const changeButton = button ? "profileButtonOn" : "profileButton"

  console.log(button)

  return (
    <>
      <div className={ulClassName} ref={ulRef}>
      {user ? (
        <>
          <div className='dropdown'>
            <p>Hello, {user.username}</p>
            {/* <p>{user.firstName} {user.lastName}</p> */}
            <p>{user.email}</p>
            <div className='divide'></div>
            <p className='logoutUser' onClick={logout}>Log Out</p>
          </div>
        </>
        ) : null
        }
      </div>
      <div className={changeButton} onClick={openMenu}>
        <i className="fa-regular fa-user"></i>
      </div>
      </>
  );
}

export default ProfileButton;
