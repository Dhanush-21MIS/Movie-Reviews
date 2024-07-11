import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signin.css';

const Signin = ({ setLoggedIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Sign Up
      try {
        const response = await axios.post('http://localhost:3001/signup', {
          username,
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        setLoggedIn(true);
        navigate('/');
      } catch (err) {
        console.error('Error signing up:', err);
        setError('Failed to sign up. Please try again.');
      }
    } else {
      // Sign In
      try {
        const response = await axios.post('http://localhost:3001/login', {
          email,
          password,
        });
        localStorage.setItem('token', response.data.token);
        setLoggedIn(true);
        navigate('/');
      } catch (err) {
        console.error('Error signing in:', err);
        setError('Invalid credentials. Please try again.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </>
        )}
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-button">
        {isSignUp ? 'Have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};

export default Signin;
