import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom';


function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();

  let sessionLinks;
  if (sessionUser && isLoaded) {
    sessionLinks = (
      <div className='user'>
        <Link className='startG' to='/'>Start a new group</Link>
        <ProfileButton user={sessionUser} />
      </div>
    );
  } else {
    sessionLinks = (
        <div className='session'>
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
  }

  let handleClick = () => {
    history.push('/')
  }

  return (
    <div className='nav'>
        <h1 className='meetup' onClick={handleClick}>Meetup</h1>
        <div className='authen'>
        {sessionLinks}
        </div>
    </div>
  );
}

export default Navigation;
