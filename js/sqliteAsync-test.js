const Database = require('sqlite-async')


let db
Database.open('users.db').then((_db) => {
	db = _db
	console.log(db)
})
db.all('SELECT * FROM users WHERE email =?').then((rows) => {
	assert.deepStrictEqual(rows, [
		{
			
		}
	])
})