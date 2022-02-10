// const { initialize } = require("passport")
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose()
//const sqlite = require('aa-sqlite')
const db = require('./users')

db2 = new sqlite3.Database('./js/users.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the in-memory SQlite database.');
});


function initialize(passport) {
	const authenticateUser = async (email, password, done) => {

		let user = []
		const sql = 'SELECT * FROM users WHERE email =?'
		await db2.all(sql, [email], function (err, rows) {
			if (err) {
				return done(err)
			}
			rows.forEach((row) => {
				user.push(row)
				console.log(user)
				console.log(user[0].password)

			});
		})
		// const user = db.getUserByEmail(email)

		// if (user == null) {
		// 	return done(null, false, {message: 'No User with that email'})
		// }
		try {
			if (await bcrypt.compare(password, user[0].password)) {
				return done(null, user)
			} else {
				return done(null, false, { message: 'Password incorrect' })
			}
		} catch (e) {
			return done(e)
		}
	}

	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
	passport.serializeUser((user, done) => done(null, user.id))
	passport.deserializeUser((id, done) => {
		return done(null,
			db.get(`SELECT * FROM users WHERE id =?`, id, function (err, user) {
				if (err) {
					return done(err)
				}
				if (!user) {
					return done(null, false, { message: 'No user by this ID' })
				}
			})
			//db.getUserByID(id)
		)
	})
}



module.exports = initialize



// function initialize(passport, getUserByEmail, getUserById) {
// 	const authenticateUser = async (email, password, done) => {
// 		const user = getUserByEmail(email)
// 		if (user == null) {
// 			return done(null, false, { message: 'No user with that email' })
// 		}

// 		try {
// 			if (await bcrypt.compare(password, user.password)) {
// 				return done(null, user)
// 			} else {
// 				return done(null, false, { message: 'Password incorrect' })
// 			}
// 		} catch (e) {
// 			return done(e)
// 		}
// 	}

// 	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
// 	passport.serializeUser((user, done) => done(null, user.id))
// 	passport.deserializeUser((id, done) => {
// 		return done(null, getUserById(id))
// 	})
// }












// module.exports = async function (passport) {
// 	sql = new sqlite3.Database('./js/users.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
// 		if (err) {
// 			return console.error(err.message);
// 		}
// 		console.log('Connected to the in-memory SQlite database.');
// 	});
// 	passport.use(
// 		new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

// 			const user = knex.getUserByEmail(email)

// 			if (user == null) {
// 				return done(null, false, { message: 'No user with that email' })
// 			}

// 			try {
// 				if (await bcrypt.compare(password, user.password)) {
// 					return done(null, user)
// 					sql.close((err) => {
// 						if (err) {
// 							return console.error(err.message);
// 							}
// 						console.log('Close the database connection.')
// 						});

// 				} else {

// 					return done(null, false, { message: 'Password incorrect' })
// 				}

// 			} catch (e) {
// 				return done(e)
// 			}


// 		})
// 	)
// 	passport.serializeUser((user, done) => {
// 		done(null, user.id)
// 	})
// 	passport.deserializeUser((id, done) => {
// 		return done(null, knex.getUserById(id))
// 	});

// }
