def get_words():
	with open('words.txt', 'r') as f:
		words = f.read().splitlines()
	return words