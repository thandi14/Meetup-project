import React, { useState } from "react";
import * as sessionActions from "../../store/session"
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import './LoginForm.css'
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.loginUser({ credential, password })).then(history.push('/'))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  return (
    <div className='login'>
      <h1>Log In</h1>
      <h3 className='sign'>Dont have an account? <OpenModalButton
        buttonText="Sign Up"
        modalComponent={<SignupFormModal />}
      /></h3>
      <form className='form' onSubmit={handleSubmit}>
        <label>
          <input className='input'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder='Username or Email'
          />
        </label>
        <label>
          <input className='input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.credential && <p className='error'>{errors.credential}</p>}
        <button className='buttonForm' type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
