import { getRandom } from './libtools.js';


import * as totalCards from './files/cards.json' assert {
	type: 'json',
};

export class gameStateHandler {
	player1;
	player2;
	map;
	isFull;
	gameID;
	round;

	constructor(gameID) {
		this.player1 = 0;
		this.player2 = 0;
		this.isFull = false;
		this.gameID = gameID;
		this.round = {
			player1: undefined,
			player2: undefined
		}
		this.gameState = [{
			player1Deck: undefined,
			player2Deck: undefined,
			player1Hand: undefined,
			player2Hand: undefined,
		}]
	}

	joinGame(socketID) {
		this.player1 = socketID;
	}

	dealHand(player) {
		//draw 4 unique cards
		let cardHand = []
		let isUnique = false
		for (let i = 0; i < 4; i++) {
			let selectedCard = getRandom(0, 15)

			while (cardHand.includes(selectedCard)) {
				selectedCard = getRandom(0, 15)
			}

			cardHand.push(selectedCard);
		}


		console.log(cardHand)
	}

	addPlayer(socketID) {
		this.player2 = socketID;
		this.isFull = true;
	}

	checkPlayer(socketID) {
		if (socketID == this.player1) {
			return "player1";
		} else if (socketID == this.player2) {
			return "player2";
		} else {
			return "neither";
		}
	}

	otherPlayer(playerString) {
		if (playerString == "player1") {
			return this.player2
		}
		else if (playerString == "player2") {
			return this.player1
		}
		else {
			throw new Error('input string is neither player1 or 2')
		}
	}

	chooseMap() { }

	chooseDeck() { }

	startRound() { }
}
