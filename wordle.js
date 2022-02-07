

const tileDisplay =document.querySelector('.tile-container')
const keyBoard =document.querySelector('.key-container')
const messageDisplay =document.querySelector('.message-container')

let wordle 
const getWordle = () => {
	fetch('http://localhost:3000/word')
		.then(response => response.json())
		.then(json => {
			console.log(json)
			wordle = json.toUpperCase()

		})
		.catch(err => console.log(err))
}
getWordle()
const keys = [
	'Q',
	'W',
	'E',
	'R',
	'T',
	'Y',
	'U',
	'I',
	'O',
	'P',
	'A',
	'S',
	'D',
	'F',
	'G',
	'H',
	'J',
	'K',
	'L',
	'ENTER',
	'Z',
	'X',
	'C',
	'V',
	'B',
	'N',
	'M',
	'<<',
]
const guessRows = [
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', ''],
	['', '', '', '', '']
]
let isGameOver = false
let currentRow = 0
let currentTile = 0
guessRows.forEach((guessRow, guessRowIndex) => {
	const rowElement = document.createElement('div')
	rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
	guessRow.forEach((guess, guessIndex) => {
		const tileElement = document.createElement('div')
		tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
		tileElement.classList.add('tile')
		rowElement.append(tileElement)

	})

	tileDisplay.append(rowElement)
})


keys.forEach(key => {
	const buttonElement = document.createElement('button')
	buttonElement.textContent = key
	buttonElement.setAttribute('id', key)
	buttonElement.addEventListener('click', () => handleClick(key))
	keyBoard.append(buttonElement)
})

const handleClick = (key) => {
	if (!isGameOver) {
		if (key === '<<') {
			deleteLetter()
			return
		}
		if (key === 'ENTER') {
			checkRow()
			return
		}
		addLetter(key)
	}
	
}


const addLetter = (key) => {
	if (currentTile < 5 && currentRow < 6) {
	const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
	tile.textContent = key
	guessRows[currentRow][currentTile] = key
	tile.setAttribute('data', key)
	currentTile++
	console.log('guessRows', guessRows)	
	}
}

const deleteLetter = () => {
	if (currentTile > 0) {
	currentTile--
	const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
	tile.textContent = ''
	tile.setAttribute('data', '')
	}
}
const checkRow = () => {
	const guess = guessRows[currentRow].join('')
	console.log('guess', guess)
	if (currentTile > 4) {
		fetch(`http://localhost:3000/check/?word=${guess}`)
			.then(response => response.json())
			.then(json => {
				console.log(json)
				if (json == 'Entry word not found') {
					showMessage('word not in list')
					return
				} else {
					console.log('guess is ' + guess, 'worlde is ' + wordle)
					flipTile()
					if (wordle == guess) {
						showMessage('Magnificent')
						isGameOver = true
						return

					} else {
						if (currentRow >=5) {
							isGameOver = true
							showMessage('Game Over')
							return
						}
						if (currentRow < 5) {
							currentRow++
							currentTile = 0
						}
					}			
				}		
			}).catch(err => {console.log(err)})
	}
}
const showMessage = (message)=> {
	const messageElement = document.createElement('p')
	messageElement.textContent = message
	messageDisplay.append(messageElement)
	setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}
const addColortoKey = (keyLetter, color) => {
	const key = document.getElementById(keyLetter)
	key.classList.add(color)
}
const flipTile= () => {
	const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
	let checkWordle = wordle
	const guess = []
	rowTiles.forEach(tile => {
		guess.push({ key: tile.getAttribute('data'), color: 'grey-overlay'})
	})
	guess.forEach((guess, index) => {
		if (guess.key == wordle[index]) {
			guess.color = 'green-overlay'
			checkWordle = checkWordle.replace(guess.key, '')
		}
	})

	guess.forEach(guess => {
		if (checkWordle.includes(guess.key)) {
			guess.color = 'yellow-overlay'
			checkWordle = checkWordle.replace(guess.key, '')
		}
	})
	rowTiles.forEach((tile, index) => {
		const dataLetter = tile.getAttribute('data')

		setTimeout(() => {
			tile.classList.add('flip')
			tile.classList.add(guess[index].color)
			addColortoKey(guess[index].key, guess[index].color)
		}, 600 * index)
	})

}