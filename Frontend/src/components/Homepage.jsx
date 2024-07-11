import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Homepage.css'; // Import the CSS file for styling
import { Link } from 'react-router-dom';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noMoviesFound, setNoMoviesFound] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/data'); // Replace with your backend URL
        setMovies(response.data);
        setFilteredMovies(response.data); // Initialize with all movies
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    setFilteredMovies([...movies]); // Initialize filteredMovies with all movies on mount
  }, [movies]);

  const filterMovies = (criteria) => {
    let sortedMovies = [...movies]; // Create a copy of movies array to work with

    switch (criteria) {
      case 'latest':
        sortedMovies.sort((a, b) => b.Year - a.Year);
        break;
      case 'oldest':
        sortedMovies.sort((a, b) => a.Year - b.Year);
        break;
      case 'high-rated':
        sortedMovies.sort((a, b) => b.Ratings - a.Ratings);
        break;
      case 'low-rated':
        sortedMovies.sort((a, b) => a.Ratings - b.Ratings);
        break;
      default:
        break;
    }

    setFilteredMovies(sortedMovies.slice(0, 10)); // Update filteredMovies state with top 10 sorted movies
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterMoviesBySearch(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredMovies([...movies]); // Reset filtered movies to all movies
    setNoMoviesFound(false); // Reset noMoviesFound state
  };

  const filterMoviesBySearch = (query) => {
    if (!query) {
      setFilteredMovies([...movies]);
      setNoMoviesFound(false);
      return;
    }

    const filtered = movies.filter((movie) =>
      movie.Name.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredMovies(filtered.slice(0, 10)); // Update filteredMovies state with top 10 search results
    setNoMoviesFound(filtered.length === 0);
  };

  return (
    <div className="movie-list">
      <div className="filter-buttons">
        <button onClick={() => filterMovies('latest')}>Latest Movies</button>
        <button onClick={() => filterMovies('oldest')}>Oldest Movies</button>
        <button onClick={() => filterMovies('high-rated')}>High Rated Movies</button>
        <button onClick={() => filterMovies('low-rated')}>Low Rated Movies</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by movie title..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button className="clear-search" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </div>
      {noMoviesFound ? (
        <p className="no-movies-found">No movies found</p>
      ) : (
        <div className="movie-cards">
          {filteredMovies.map((movie) => (
            <Link to={`/movie/${movie._id}`} key={movie._id} className="movie-card-link">
              <div className="movie-card">
                <img src={movie.URL} alt={`${movie.Name} poster`} className="movie-poster" />
                <div className="movie-details">
                  <h2>{movie.Name}</h2>
                  <p>Release Year: {movie.Year}</p>
                  <p>Ratings:{movie.Ratings}<span> ★ </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;
