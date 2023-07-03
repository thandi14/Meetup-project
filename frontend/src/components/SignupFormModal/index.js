import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import './SignupForm.css'


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
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

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
        {errors.email && <p>{errors.email}</p>}
        <label>
          <input className='input'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Username'
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          <input className='input'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder='First Name'
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          <input className="input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          <input className='input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          <input className="input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button className="buttonForm" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
