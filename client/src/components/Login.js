// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSignUpClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const parseRes = await response.json();

      if (parseRes.user_id) {
        // User logged in successfully, redirect to MainPage
        navigate.push('/mainpage');
      } else {
        // Handle login failure (e.g., show an error message)
        console.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-overlay">
      <form className="login-panel" onSubmit={handleLogin}>
        <button type="button" className="close-button" onClick={onClose}>X</button>
        <h2>Login</h2>
        <input 
          type="text" 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">Log In</button>
        <p className="switch-form-text">
          New Here? <span onClick={onSignUpClick}>Sign Up!</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
