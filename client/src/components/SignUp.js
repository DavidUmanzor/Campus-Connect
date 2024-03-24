// SignUp.js

import React, { useState } from 'react';
import './SignUp.css';

const SignUp = ({ onLoginClick, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [errors, setErrors] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!name) {
      formIsValid = false;
      errors["name"] = "Name is required.";
    }

    if (!email) {
      formIsValid = false;
      errors["email"] = "Email is required.";
    }

    if (!password) {
      formIsValid = false;
      errors["password"] = "Password is required.";
    }

    if (!university) {
      formIsValid = false;
      errors["university"] = "University is required.";
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          university, // Assumes your backend handles the university accordingly
          role: 'student', // Default role
        }),
      });

      if (response.ok) {
        alert('Account successfully created. Please log in.');
        onLoginClick(); // Switch to login form
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create account.');
      }
    } catch (error) {
      console.error('SignUp Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-panel">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Name"
          className={errors.name ? 'error' : ''}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
        <input
          type="email"
          placeholder="Email"
          className={errors.email ? 'error' : ''}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          type="password"
          placeholder="Password"
          className={errors.password ? 'error' : ''}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <input
          type="text"
          placeholder="University"
          className={errors.university ? 'error' : ''}
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
        {errors.university && <p className="error-text">{errors.university}</p>}
        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
        <p className="switch-form-text">
          Have an Account? <span onClick={onLoginClick}>Log In!</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
