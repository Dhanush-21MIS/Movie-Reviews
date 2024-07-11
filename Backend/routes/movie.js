// routes/movies.js

const express = require('express');
const router = express.Router();
const Movie = require('./models/movie');
const User = require('./models/User');
const Review = require('./models/Review');

// Fetch movie details by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;