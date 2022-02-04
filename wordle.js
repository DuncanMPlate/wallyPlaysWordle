const tileDisplay =document.querySelector('.tile-container')
const keyBoard =document.querySelector('.key-container')
const messageDisplay =document.querySelector('.message-container')

const wordle = 'SUPER'
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
	console.log('clicked', key)
	if (key == '<<') {
		deleteLetter()
		return
	}
	if (key == 'ENTER') {
		console.log('check row')
		checkRow()
		return
	}
	addLetter(key)
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
	if (currentTile === 5) {
		
		console.log('guess is ' + guess, 'worlde is ' + wordle)
		if (wordle == guess) {
			showMessage('Magnificent')
		}
	}
}
const showMessage = (message)=> {
	const messageElement = document.createElement('p')
	messageElement.textContent = message
	messageDisplay.append(messageElement)
}