// Packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Users Data
const users = require("../database/helpers/users-model.js");

// Environmental Variables
const secrets = require("./secrets.js");

// Middleware and Token
const { authenticate, generateToken } = require("../auth/authenticate");

// Endpoints
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
  let { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "Please login with a username and password." });
  } else {
    users
      .findBy({ username })
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Login success! Welcome ${user.username}!`,
            user,
            token
          });
        } else {
          res.status(401).json({ error: "You shall not pass!" });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "Uh oh! There was an error logging you in." });
      });
  }
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

// importing token from > auth > authentication
