import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import './SignupForm.css'
import { useHistory } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";


function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signupUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
        ) .then(history.push('/'))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            console.log(data)
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  console.log(errors)

  return (
    <div className='signup'>
      <h1>Sign Up</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label>
          <input className="input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
          />
        </label>
        {errors.email && <p className='error'>{errors.email}</p>}
        <label>
          <input className='input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
          />
        </label>
        {errors.username && <p className='error'>{errors.username}</p>}
        {username.length < 4 && username.length >= 1 ? <p className='error'>Username must be longer than 4 characters</p> : null}

        <label>
          <input className='input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
          />
        </label>
        {errors.firstName && <p className='error'>{errors.firstName}</p>}
        <label>
          <input className="input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p className='error'>{errors.lastName}</p>}
        <label>
          <input className='input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p className='error'>{errors.password}</p>}
        {password.length < 6 && password.length >= 1 ? <p className='error'>Password must be longer than 6 characters</p> : null}
        <label>
          <input className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && <p className='error'>{errors.confirmPassword}</p>}
        {password.length > 6 && username.length > 4 && firstName && lastName && email && username && confirmPassword ? <button className='buttonForm' type="submit">Sign Up</button> : <button disabled={true} className='buttonForm1' type="submit">Sign Up</button>}
        <h3 class='log'>Already have an account? <OpenModalButton
        buttonText="Log In"
        modalComponent={<LoginFormModal />}
      /> </h3>
      </form>
    </div>
  );
}

export default SignupFormModal;
