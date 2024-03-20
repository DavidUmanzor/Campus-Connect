import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onSignUpClick, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // useNavigate instead of useHistory
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Here you would replace '/login' with your server endpoint for the login
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        // Assuming the server responds with the user data on successful login
        // Navigate to MainPage on successful login
        navigate('/mainpage');
      } else {
        // If login is not successful, handle it here
        // You could set an error message in your state and display it to the user
        console.error(responseData.message); // Log or display error message from server
      }
    } catch (error) {
      console.error(error);
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
