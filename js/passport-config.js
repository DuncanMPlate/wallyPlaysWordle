// const { initialize } = require("passport")
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3').verbose()
const sqlite = require('aa-sqlite')





module.exports = async function(passport) {
	await sqlite.open('./users.db')
	passport.use(
		new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
			//MatchUser
			const sql = 'SELECT * FROM users WHERE email =?'			
			 await sqlite.get(sql, [ email ], function(err, user) {
				if (err) {
					return done(err)
				}
				if (!user) {
					return done(null, false, {message: 'No user by this email'})
				}
			//MatchPassword
			bcrypt.compare(password, user.password, (err, isMatch) =>{
				if (err) throw err
				if (isMatch) {
					return done(null, user)
				} else {
					return done(null, false, {message: 'Password incorrect'})
				}
			})
			})
			sqlite.close()
		})	
	)
passport.serializeUser((user, done) => {
	done(null, user.id)
})
passport.deserializeUser((id, done) => {
	User.FindbyID(id, (err, user) => {
		done(err, user)
	})
})
}
