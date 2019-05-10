// Packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Users Data
const users = require("../database/helpers/users-model.js");

// Environmental Variables
const secrets = require("./secrets.js");

// Middleware for /api/jokes
const { authenticate } = require("../auth/authenticate");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/users", getUsers);
  server.get("/api/jokes", authenticate, getJokes);
};

// Register
function register(req, res) {
  // implement user registration
  let user = req.body;

  if (!user.username || !user.password) {
    res
      .status(400)
      .json({ error: "Please register with a username and password." });
  } else {
    // hash password
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    users
      .add(user)
      .then(user => {
        // generate token
        const token = generateToken(user);

        res.status(201).json({
          message: `Registration success! Welcome ${user.username}!`,
          user,
          token
        });
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error registering this user to the database."
        });
      });
  }
}

// Login
function login(req, res) {
  // implement user login
}

// Users
function getUsers(req, res) {
  users
    .find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    });
}

// Jokes
function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: "application/json" }
  };

  axios
    .get("https://icanhazdadjoke.com/search", requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}

// Token

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };

  const secret = secrets.jwtSecret;

  const options = {
    expiresIn: "5h"
  };

  return jwt.sign(payload, secret, options);
}
