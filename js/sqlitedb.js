const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database('./users.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
	if (err) {
		return console.error(err.message)
	}
	console.log('Connected to the in-memory SQlite database')
})
//GetuserbyID

//getUserbyEmail

//AddUser
// function AddUser( username, email, password, id) {
// 	const sql = "INSERT INTO users (username, email, password, id) VALUES(?,?,?,?)"
	
// }
//db.run('DELETE FROM users')

//db.run('CREATE TABLE users(username, email, password, id)')

// const sql = "INSERT INTO users (username, email, password, id) VALUES(?,?,?,?)"

// db.run(sql, ["mike", "codes@email.com", "123", 1], (err) => {
// 	f (err) {
// 		return console.error(err.message)
// 	}
// 	console.log("new user added")
// })
const sql = "SELECT * FROM users"

db.all(sql, [], (err, rows) => {
	if (err) {
		return console.error(err.message)
	}
	rows.forEach((row) => {
		console.log(row)
	})
}
)

db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});