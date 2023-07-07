import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session'
import { useState } from "react";




function MenuModal({ user }) {
    const history = useHistory();
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(true);


    const closeMenu = () => setShowMenu(false);

    const logout = (e) => {
      e.preventDefault();
      dispatch(sessionActions.logoutUser()).then(history.push('/'));
      closeMenu();
    };

    return (
        <div className='dropdown'>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </div>
    )
}

export default MenuModal
