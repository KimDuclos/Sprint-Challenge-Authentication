const db =  require('../database/dbConfig');

module.exports = {
    getUserByName, 
    addUser
};

// GET user by name
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

// GET user by ID
function getUserById(id) {
    return db('users')
    .where({ id })
    .first();
}