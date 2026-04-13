🎬 Movie Review System

A full-stack web application that allows users to browse movies, view details, and write reviews. Built using the MERN stack (MongoDB, Express, React, Node.js).

---

## 🚀 Features

* 🔐 User Authentication (Signup/Login)
* 🎥 Browse Movies
* 📄 View Movie Details
* ✍️ Add, Edit, and Delete Reviews
* ⭐ Rating System
* 🔎 Filter Movies (Latest, Top Rated, etc.)
* 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* CSS
### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* JWT (Authentication)
* Cloudinary 

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/movie-review-system.git
cd movie-review-system
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the **server** folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4️⃣ Run the Application

#### Start Backend

```bash
cd server
npm start
```

#### Start Frontend

```bash
cd client
npm start
```

---

## 🔗 API Endpoints

### Auth

* `POST /api/auth/signup` → Register user
* `POST /api/auth/login` → Login user

### Movies

* `GET /api/movies` → Get all movies
* `GET /api/movies/:id` → Get single movie

### Reviews

* `POST /api/reviews` → Add review
* `PUT /api/reviews/:id` → Update review
* `DELETE /api/reviews/:id` → Delete review

---

**Dhanush M**
