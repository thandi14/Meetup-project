import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { useHistory, Link } from "react-router-dom";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';


function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const closeMenu = () => {
    setShowMenu(false)
  }


  const openMenu = () => {
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

  const changeButton = showMenu ? "profileButtonOn" : "profileButton"

  return (
    <>
      <div className={ulClassName} ref={ulRef}>
      {user ? (
        <>
          <div className='dropdown'>
            <p>Hello, {user.username}</p>
            <p>
              <Link className='menuLink' to="/groups">View groups</Link>
              </p>
              <p>
            <Link className="menuLink" to="/events">View events</Link>
              </p>
            <p id="top-top">{user.email}</p>
              <p>
            <Link className="menuLink" to="/groups/current">Your groups</Link>
              </p>
              <p id="bottom-bottom">
            <Link className="menuLink" to="/events/current">Your events</Link>
              </p>
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
