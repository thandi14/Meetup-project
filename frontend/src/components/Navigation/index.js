import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom';
import OpenModalButton from '../OpenModalButton'
import OpenModalMenuItem from './OpenModalMenuItem';
import { useState, useEffect, useRef } from 'react';
import * as sessionActions from '../../store/session'


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  let handleClick = () => {
    history.push('/')
  }
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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
    dispatch(sessionActions.logoutUser());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


  const sessionLinks = (
    <div className='sessionLinks'>
      <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal />}
      />
      <OpenModalButton
        buttonText="Sign Up"
        modalComponent={<SignupFormModal />}
      />
    </div>
  );

  return (
    <div className='nav'>
        <div className='meetusNav'>
        <h1 className='meetup' onClick={handleClick}>Meetus</h1>
        <img className='meetIcon' src='https://pngimg.com/d/heart_PNG51342.png'></img>
        </div>
        <div className='authen'>
        {sessionUser ? (
          <div>
          <div className='user'>
          <Link className='startG' to='/groups/new'>Start a new group</Link>
          <ProfileButton user={sessionUser} />
          </div>
          <div>
          </div>
          </div>
        ) : sessionLinks}
        </div>
    </div>
  );
}

export default Navigation;
