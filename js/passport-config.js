// const { initialize } = require("passport")
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose()
//const sqlite = require('aa-sqlite')
const db = require('./users')




module.exports = async function(passport) {
	
	passport.use(
		new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
			
				const user = db.getUserByEmail(email)
				if (user == null) {
					return done(null, false, { message: 'No user with that email' })
				}

				try {
					if (await bcrypt.compare(password, user.password)) {
						return done(null, user)
					} else {
						return done(null, false, { message: 'Password incorrect' })
					}
				} catch (e) {
					return done(e)
				}
			
			
		})	
	)
	passport.serializeUser((user, done) => {
	done(null, user.id)
})
	passport.deserializeUser((id, done) => {
		return done(null, db.getUserById(id))
	});

}
