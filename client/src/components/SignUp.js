// SignUp.js

import React from 'react';
import './SignUp.css';

const SignUp = ({ onLoginClick, onClose }) => {
  return (
    <div className="signup-overlay">
      <div className="signup-panel">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Sign Up</h2>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="text" placeholder="University" />
        <button className="signup-button">Sign Up</button>
        <p className="switch-form-text">
          Have an Account? <span onClick={onLoginClick}>Log In!</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
