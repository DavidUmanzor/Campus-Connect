// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSignUpClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Add this line
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
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
            if (responseData.user_id !== undefined) {
                localStorage.setItem('userId', responseData.user_id.toString());
                navigate('/mainpage');
            } else {
                setErrorMessage("User ID not found in response"); // Handle no user_id found
            }
        } else {
            // If login is not successful, display the error message
            setErrorMessage(responseData.message || 'Login failed. Please try again.'); // Update here to display message
        }
    } catch (error) {
      console.error(error);
      setErrorMessage('An unexpected error occurred. Please try again.'); // Handle unexpected error
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-panel">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Login</h2>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display the error message here */}
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
