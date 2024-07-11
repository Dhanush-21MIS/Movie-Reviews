import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <button onClick={handleSignOut} className="signout-button">
      Sign Out
    </button>
  );
};

export default SignOut;
