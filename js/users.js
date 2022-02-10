const knex = require('./knex')
// const express = require("express")
// const app = express()
// const bodyParser = require('body-parser')
// app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json())
// const session = require('express-session')
// app.use(session({
// 	secret: process.env.SECRETSECRET,
// 	resave: true,
// 	saveUnitialized: true,
// }))


function createUser(user) {
	// app.post('/users', async (req, res) => {

	// 	try {
	// 		if (user != null)
	// 		res.status(201).json({id: results[0]})
	// 		res.redirect('/login')
	// 	} catch {
	// 		console.log('User Not Created')
	// 		res.redirect('/register')
	// 	}
	
	// });
	return knex('users').insert(user)
}
function getAllUsers() {
	return knex('users').select("*")

}
function getUserByEmail(email) {
	return knex('users').select("*").where('email', email)
}
function getUserByID(id) {
	return knex('users').select("*").where('id', id)
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
// app.listen(1337, (err) => {
// 	if (err) {
// 		console.log("Error in set up")
// 	}
// 	console.log('Server running on port:1337')
// })