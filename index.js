const path = require("path")
const PORT =  5000
const axios = require("axios").default
const express = require("express")
const fs = require('fs')
const cors = require("cors")
const sqlite3 = require('sqlite3').verbose();
const db = require('./js/users');
const req = require("express/lib/request")
const methodOverride = require('method-override')
require('dotenv').config() 
const app = express()
const flash = require('express-flash')
const session = require('express-session')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
const bcrypt = require('bcrypt')

const passport = require("passport")
sql = new sqlite3.Database('./js/users.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Connected to the in-memory SQlite database.');
});

// Passport Config
//require('./js/passport-config')(passport)
const initializePassport = require('./js/passport-config')
const { callbackify } = require("util")
initializePassport(
	passport,
	email => db.getUserByEmail(user => user.email === email),
	id => db.getUserByID(user => user.id === id)
)
// const users = []
// const srch = 'SELECT * FROM users '
// sql.all(srch, [], function (err, rows) {
// 	if (err) {
// 		return done(err)
// 	}
// 	rows.forEach((row) => {
// 		users.push(row)
// 		console.log(row)

// 	});
// })
//Express Session
app.use(session({
	secret: process.env.SECRET,
	resave: true,
	saveUnitialized: true,
	}))
//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//connect Flash
app.use(flash())



//Routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html',))
	
});
 
app.get('/index.html', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html',))
});

app.get('/wordle.html',  function (req, res) {
	res.sendFile(path.join(__dirname, "/wordle.html"))
});

app.get('/style.css', function (req, res) {
	res.sendFile(__dirname + "/" + "style.css");
});

app.get('/wordle.js', function (req, res) {
	res.sendFile(__dirname + "/" + "wordle.js");
});

app.get('/accounts.html', function (req, res) {
	res.sendFile(__dirname + "/" + "accounts.html");
});

app.get('/leader.html', function (req, res) {
	res.sendFile(__dirname + "/" + "leader.html");
});

app.get('/login', function (req, res)  {
	res.sendFile(__dirname + "/" + "login.html");
});

app.get('/register', function (req, res) {
	res.sendFile(__dirname + "/" + "register.html");
		
});

// app.get('/users', checkAuthenticated, function(req, res){
//  	res.sendFile(__dirname + "/js/users.sqlite3")
// })

//Posts
app.post("/login", async (req, res, done) => {

	try {
		if (!req.body.email || !req.body.password) {
			return res.status(400).send("Email and password is required");
		}

		const { email, password } = req.body;

		//let user = []
		
		// sql.all(srch, [email], function (err, rows) {
		// 	if (err) {
		// 		return done(err)
		// 	}
		// 	rows.forEach((row) => {
		// 		user.push(row)
		// 		console.log(user)
		// 		console.log(user[0].password)

		// 	});
		// })
		const query = 'SELECT * FROM users WHERE email =?'
		function sqlQuery(query, params) {
			return new Promise((resolve, reject) => {
				sql.all(query, params, (err, rows) => {
					if (err) {
						return reject(err);
					}
					return resolve(rows);
				})
			});
		}
		const user = await sqlQuery(query, email)

		if (user == null) {
			console.log("user not found");
			return done(res.status(401).json({ message: "Authentication failed" }));
		}
		
		if (await bcrypt.compare(password, user[0].password), function(error, isMatch) {
			if (error) {
				return (error)
			}
			return (isMatch)
		}) {
			return done( res.redirect('/'))
		} else {
			return done(null, false, { message: 'Password incorrect' })
		}	
	} catch (err) {
		console.log("Err: ", err);
		res.status(500).json({ error: err });
	}
});
// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
// 	successRedirect: '/',
// 	failureRedirect: '/login',
// 	failureFlash: true
// }))
// async function makeUser(req, res, next) {
// 	try {
// 		if (user != null) {
// 			await db.createUser(makeUser, (err) => {
// 				if (err) {
// 					return console.error(err.message)
// 				}
// 				console.log("new user added")
// 				res.status(200).json({ user })
// 				next()
// 			})
// 		}
// 	} catch (err) {
// 		throw err
// 	}

// }
//app.use(makeUser())



app.post('/register', async (req, res) => {
	try {	
		
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		await sql.get(`INSERT INTO users (username, id, email, password) VALUES (?,?,?,?)`, [req.body.name, Date.now(), req.body.email, hashedPassword], (err) => {
			if (err) {
				return console.error(err.message)
			}
		})
		// sql.close((err) => {
		// 	if (err) {
		// 		return console.error(err.message);
		// 	}
		// 	console.log('Close the database connection.');
		// });
		console.log("new user added")
		res.redirect('/login')
		
	} catch {
		console.log('User Not Created')
		res.redirect('/register')	
	}

})

app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/')
})
//Wordle Functions
app.get('/word', (req, res) => {
	// console.log(res)
	const file = fs.readFileSync(path.join(__dirname, '/words/words.txt'), 'utf8');
	const wordarry = file.split(/\r?\n/)
	const min = Math.ceil(0)
	const max = Math.max(wordarry.length)
	const wod = Math.floor(Math.random() * (max -min) + min)
	const wordle = wordarry[wod]
	
	res.json(wordle)
	
})

app.get('/check', (req, res) => {
	const file = fs.readFileSync(path.join(__dirname, '/words/words.txt'), 'utf8');
	const wordarry = file.split(/\r?\n/)
	const word = req.query.word.toLowerCase()
	
	if (wordarry.includes(word)) {
		res.json(word)}
		else {
			res.json('Entry word not found')
		}
	
})

//Authentication checks for /s
// function checkAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return next()
// 	}
// 	res.redirect('/login')
// }
// function checkNotAuthenticated(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		return res.redirect('/')
// 	}
// 	next()
// }
app.listen(PORT, () => console.log('Server running on port' + PORT))
