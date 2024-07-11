const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Director: { type: String, required: true },
  Year: { type: Date, required: true },
  Description: { type: String, required: true },
  Genre: { type: String, required: true },
  Cast: [{ name: String, role: String }],
  Ratings: { type: Number, min: 0, max: 10 },
  URL: {String}

});

const userschema = new mongoose.Schema({
   UserName: { type: String, required: true },
   Password: { type: String, required: true},
   Emailid: {type: String, required: true}
});

const reviewschema = new mongoose.Schema({
   UserName: {type: String, required: true},
   Review: {type: String, required: true},
   Ratings: {type: Number, required: true}
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User',userschema);
const Review = mongoose.model('Review',reviewschema);

module.exports = Movie;
module.exports = User;
module.exports = Review;