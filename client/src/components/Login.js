// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSignUpClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const responseData = await response.json();

        if (response.ok) {
            // Check if the responseData actually contains the userId
            if (responseData.user_id !== undefined) {
                // Store the user ID in localStorage
                localStorage.setItem('userId', responseData.user_id.toString());

                // Navigate to MainPage on successful login
                navigate('/mainpage');
            } else {
                // Log or handle the case where user_id is not part of the response
                console.error("User ID not found in response");
            }
        } else {
            // If login is not successful, handle it here
            console.error(responseData.message); // Display or log error message from server
        }
    } catch (error) {
      console.error(error); // Display or log the error
    }
};

  return (
    <div className="login-overlay">
      <div className="login-panel">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className="switch-form-text">
          New Here? <span onClick={onSignUpClick}>Sign Up!</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
