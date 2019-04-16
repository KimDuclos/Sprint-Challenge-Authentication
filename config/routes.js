const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./routesModels');
const secret = process.env.shh || 'abcd';

require("../auth/authenticate").jwtKey;
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

// MVP - registration
function register(req, res) {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  if (user.username && user.password) { // check creds
    db.addUser(user)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        res.status(500).json({ message: 'Could not save user.' });
      });
  } else {
    res.status(401).json({ message: 'Username and password required.' });
  }
}

// MVP - login
function login(req, res) {
  const { username, password } = req.body;

  if (username && password) {  // check creds
    db.getUserByName({ username })
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);

          res.status(200).json({ message: 'Logged in', token });
        } else {
          res.status(401).json({ message: 'Username or password is invalid.' });
        }
      })
      .catch(err => {
        res.status(500).json({ message: 'Could not log in' });
      });
  } else {
    res.status(401).json({ message: 'Username and password required.' });
  }
}

// make token, assign to user
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '1d'  // token exp in 1 day
  };
  return jwt.sign(payload, secret, options);
}

function getJokes(req, res) {  // access joke db
  const requestOptions = {
    headers: { accept: 'application/json' }
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}