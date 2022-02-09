const knex = require('./knex')
function createUser(user) {
	return knex('users').insert(user)
}
function getAllUsers() {
	return knex('users').select("*")

}
function getUserByEmail(email) {
	return knex('users').where("email", email).select("*")
}
function getUserByID(id) {
	return knex('users').where('id', id).select(user)
}
function deleteUser(id) {
	return knex('users').where("id", id).del()

}
function updateUser(id, user) {
	return knex('users').where("id", id).udpate(user)

}
module.exports = {
	getAllUsers,
	getUserByEmail,
	getUserByID,
	deleteUser,
	updateUser,
	createUser
}