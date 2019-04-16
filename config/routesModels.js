const db = require('../database/dbConfig');

module.exports = {
  getUserByName,
  addUser
};

// GET user - name
function getUserByName(filter) {
  return db('users')
    .where(filter)
    .first();
}

// INSERT user
function addUser(user) {
  return db('users')
    .insert(user)
    .then(ids => {
      return getUserById(ids[0]);
    });
}

// GET user - id
function getUserById(id) {
  return db('users')
    .where({ id })
    .first();
}