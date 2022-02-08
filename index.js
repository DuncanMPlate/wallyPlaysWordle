const path = require("path")
const PORT =  3000
const axios = require("axios").default
const express = require("express")
const fs = require('fs')
const cors = require("cors")
const req = require("express/lib/request")
const methodOverride = require('method-override')
require('dotenv').config() 
const app = express()
const flash = require('express-flash')
const session = require('express-session')
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
const bcrypt = require('bcrypt')
const initializePassport = require('./passport-config')
const passport = require("passport")
initializePassport(
	passport, 
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id)
)
const users = []

app.use(flash())
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUnitialized: false,

}))

app.use(passport.initialize())
app.use(passport.session())


app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html',))
	
});
 
app.get('/index.html', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html',))
});

app.get('/wordle.html', checkAuthenticated,  function (req, res) {
	res.sendFile(path.join(__dirname, "/wordle.html"))
});

app.get('/style.css', function (req, res) {
	res.sendFile(__dirname + "/" + "style.css");
});

app.get('/wordle.js', function (req, res) {
	res.sendFile(__dirname + "/" + "wordle.js");
});

app.get('/accounts.html', checkAuthenticated, function (req, res) {
	res.sendFile(__dirname + "/" + "accounts.html");
});

app.get('/leader.html', checkAuthenticated, function (req, res) {
	res.sendFile(__dirname + "/" + "leader.html");
});

app.get('/login', checkNotAuthenticated, function (req, res)  {
	res.sendFile(__dirname + "/" + "login.html");
});

app.get('/register', checkNotAuthenticated, function (req, res) {
	res.sendFile(__dirname + "/" + "register.html");
		
});
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))
app.post('/register', checkNotAuthenticated, async (req, res) => {
	
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10)
		users.push({
			id: Date.now().toString(),
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword

		})
		res.redirect('/login')
	} catch {
		res.redirect('/register')
	}
	console.log(users)
});

app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/')
})

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
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	next()
}
app.listen(PORT, () => console.log('Server running on port' + PORT))
