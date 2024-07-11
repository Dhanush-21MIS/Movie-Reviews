const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

const url = 'mongodb+srv://dhanush:dhanush@cluster0.veks4zw.mongodb.net/MovieReview';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const dbName = 'MovieReview';
const movieCollectionName = 'MovieDetails';
const reviewCollectionName = 'Reviews';
const userCollectionName = 'Users';

app.use(cors());
app.use(express.json());

const JWT_SECRET = 'your_jwt_secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(userCollectionName);

    let user = await collection.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = { username, email, password: hashedPassword };
    const response = await collection.insertOne(user);

    const payload = { id: response.insertedId };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(userCollectionName);

    const user = await collection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(movieCollectionName);

    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    const query = searchTerm
      ? { title: { $regex: new RegExp(searchTerm, 'i') } }
      : {};

    const movies = await collection.find(query).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

app.get('/movie/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(movieCollectionName);

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid movie ID');
      return;
    }

    const movie = await collection.findOne({ _id: new ObjectId(id) });
    if (!movie) {
      res.status(404).send('Movie not found');
    } else {
      res.json(movie);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching movie details');
  }
});

app.post('/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { rating, reviewText } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(reviewCollectionName);

    if (!ObjectId.isValid(id)) {
      res.status(400).send('Invalid movie ID');
      return;
    }

    const response = await collection.insertOne({
      movieId: new ObjectId(id),
      rating,
      reviewText,
      createdAt: new Date(),
      userId: new ObjectId(req.user.id),
    });

    res.json(response.ops[0]);
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Error saving review' });
  }
});

// reviews by user id 
app.get('/reviews/:movieId', async (req, res) => {
  const { movieId } = req.params;

  try {
    await client.connect();
    const db = client.db(dbName);
    const reviewCollection = db.collection(reviewCollectionName);
    const userCollection = db.collection(userCollectionName);

    if (!ObjectId.isValid(movieId)) {
      res.status(400).send('Invalid movie ID');
      return;
    }

    const reviews = await reviewCollection.find({ movieId: new ObjectId(movieId) }).toArray();
    
    const reviewsWithUsernames = await Promise.all(reviews.map(async (review) => {
      const user = await userCollection.findOne({ _id: review.userId });
      return {
        ...review,
        username: user.username,
      };
    }));

    res.json(reviewsWithUsernames);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// Search function 
app.get('/data', async (req, res) => {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(movieCollectionName);

    const searchTerm = req.query.search ? req.query.search.toLowerCase() : '';
    const query = searchTerm
      ? { title: { $regex: new RegExp(searchTerm, 'i') } }
      : {};

    const movies = await collection.find(query).toArray();
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

// Backend endpoint to fetch user details
app.get('/user', authenticateToken, async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(userCollectionName);

    const user = await collection.findOne({ _id: new ObjectId(req.user.id) });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude sensitive information like password
    const { username, email, profilePicture } = user;
    res.json({ username, email, profilePicture });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Backend endpoint to update profile picture
app.put('/user/profile-picture', authenticateToken, async (req, res) => {
  const { profilePicture } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(userCollectionName);

    const result = await collection.updateOne(
      { _id: new ObjectId(req.user.id) },
      { $set: { profilePicture } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Profile picture updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or profile picture not updated' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
