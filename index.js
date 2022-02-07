const path = require("path")
const PORT =  3000
const axios = require("axios").default
const express = require("express")
const fs = require('fs')
const cors = require("cors")
require('dotenv').config() 
const app = express()
app.use(cors())

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html',))
});

app.get('/style.css', function (req, res) {
	res.sendFile(__dirname + "/" + "style.css");
});

app.get('/wordle.js', function (req, res) {
	res.sendFile(__dirname + "/" + "wordle.js");
});

app.get('/word', (req, res) => {
	// console.log(res)
	const file = fs.readFileSync(path.join(__dirname, '/words/words.txt'), 'utf8');
	const wordarry = file.split(/\r?\n/)
	const min = Math.ceil(0)
	const max = Math.max(wordarry.length)
	const wod = Math.floor(Math.random() * (max -min) + min)
	const wordle = wordarry[wod]
	
	res.json(wordle)
	// const options = {
	// 	method: 'GET',
	// 	url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
	// 	params: {count: '5', wordLength: '5'},
	// 	headers: {
	// 		'x-rapidapi-host': 'random-words5.p.rapidapi.com',
	// 		'x-rapidapi-key': process.env.RAPID_API_KEY
	//   	}
	// }
	
	// axios.request(options).then((response) => {
	// 	console.log(response.data)
	// 	res.json(response.data[0]);
	// }).catch((error) => {
	// 	console.error(error)})
})

app.get('/check', (req, res) => {
	const file = fs.readFileSync(path.join(__dirname, '/words/words.txt'), 'utf8');
	const wordarry = file.split(/\r?\n/)
	const word = req.query.word.toLowerCase()
	console.log(wordarry)
	if (wordarry.includes(word)) {
		res.json(word)}
		else {
			res.json('Entry word not found')
		}
	// const options = {
	// 	method: 'GET',
	// 	url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
	// 	params: {entry: word},
	// 	headers: {
	// 		'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
	// 		'x-rapidapi-key': process.env.RAPID_API_KEY
	// 	}
	// }
	// axios.request(options).then((response) => {
	// 	console.log(response.data)
	// 	res.json(response.data.result_msg);
	// }).catch((error) => {
	// 	console.error(error);
	// });
})


app.listen(PORT, () => console.log('Server running on port' + PORT))