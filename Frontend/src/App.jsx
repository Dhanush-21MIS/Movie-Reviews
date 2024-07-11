// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Homepage from './components/Homepage';
// import MovieDetails from './components/MovieDetails';
// import Header from './components/Header'
// import Signin from './components/Signin'

// const App = () => {
//   return (
//     <Routes>
//         <Route path="/" element={<Header/>}>
//             <Route index element={<Homepage/>} />
//             <Route path="movie/:id" element={<MovieDetails/>} />
//             <Route path="Signin" element={<Signin />} />
//         </Route>
           
//     </Routes>
//   );
// };

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Homepage from './components/Homepage';
import MovieDetails from './components/MovieDetails';
import Signin from './components/Signin';
import NavigationBar from './components/Header';
import Account from './components/Account';
import './App.css';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignIn = () => {
    setIsLoggedIn(true);
    navigate(location.pathname); // Redirect to current location after signing in
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/data');
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      {/* <header>
        <h1>Movie Review Website</h1>
      </header> */}
      <NavigationBar 
        isLoggedIn={isLoggedIn} 
        handleSignIn={() => navigate('/signin')} // Directly navigate to signin route
        handleSignOut={handleSignOut} 
      />
      <Routes>
        <Route path="/" element={<Homepage filteredMovies={filteredMovies} />} />
        <Route path="movie/:id" element={<MovieDetails />} />
        <Route path="signin" element={<Signin setLoggedIn={setIsLoggedIn} />} />
        <Route path="Account" element={<Account />}/>
        {/* Add other routes as needed */}
      </Routes>
    </div>
  );
};

export default App;
