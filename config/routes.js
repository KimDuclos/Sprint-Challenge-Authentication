const axios = require('axios');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {   // MVP IMPLEMENT REGISTER
  // implement user registration

  // get username and password from body
  const credentials = req.body; 

  // create hash from password
  const hash = bcrypt.hashsync(credentials.password, 4);

  // override password with hashed password
  credentials.password = hash;

  // save user to db
  db('users')
    .insert(credentials)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.json(err));
}

function login(req, res) {  // MVP IMPLEMENT LOGIN
  // implement user login

  // get creds
  const credentials = req.body;

  db('users')
    .where({ username: credentials.username })
    .first()
    .then (user => { 
      // check creds
      if (user && bcrypt.compareSync(credentials.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'Logged In', token });
      } else {
        res.status(401).json({ message: 'Git outta here with those bad creds!' })
      }
    })
    .catch(err => res.status(500).json(err));
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
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
