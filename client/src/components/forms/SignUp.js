import React, { useState } from 'react';
import './SignUp.css';

const SignUp = ({ onLoginClick, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCreateUniversityPrompt, setShowCreateUniversityPrompt] = useState(false);
  const [errors, setErrors] = useState({});
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const isValidEduEmail = (email) => {
    return email.match(/^[^@]+@[^@]+\.[^@]+$/) && email.endsWith('.edu');
  };

  const handleCreateUniversity = async () => {
    // Redirect user to the university creation form or handle creation logic here
    alert('Redirecting to university creation form...');
    // Reset the prompt
    setShowCreateUniversityPrompt(false);
  };

  const handleCancel = () => {
    // Reset the prompt
    setShowCreateUniversityPrompt(false);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    if (!isValidEduEmail(email)) {
      alert('Please use a valid .edu email address.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        alert('Account successfully created. Please log in.');
        onLoginClick(); // Switch to login form
      } else {
        const data = await response.json();
        if (data.createUniversity) {
          setShowCreateUniversityPrompt(true);
        } else {
          alert(data.message || 'Failed to create account.');
        }
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
        <input type="text" placeholder="Name" className={errors.name ? 'error' : ''} value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error-text">{errors.name}</p>}
        <input type="email" placeholder="Email" className={errors.email ? 'error' : ''} value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input type="password" placeholder="Password" className={errors.password ? 'error' : ''} value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
        {showCreateUniversityPrompt && (
          <div className="create-university-prompt">
            <p>No university found for your email domain. Do you want to create it?</p>
            <button onClick={handleCreateUniversity}>Yes, Create</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        )}
        <p className="switch-form-text">
          Have an Account? <span onClick={onLoginClick}>Log In!</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
