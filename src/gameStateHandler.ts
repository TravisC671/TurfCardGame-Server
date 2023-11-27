import { getRandom } from './libtools.js';


import * as totalCards from './assets/cards.json';

export enum playerEnum {
	player1,
	player2,
	notPlayer
}

type move = { cardID: number, rotation: number, positionX: number, positionY: number }

type roundType = {
	player1Move: move | undefined
	player2Move: move | undefined
}

export class gameStateHandler {
	//these are the socketID's
	player1SocketID: string | undefined;
	player2SocketID: string | undefined;
	//map;
	isFull: boolean;
	gameID: string;
	gameCards: {
		player1Deck: number[] | undefined,
		player2Deck: number[] | undefined,
		player1Hand: number[] | undefined,
		player2Hand: number[] | undefined,
	}
	gameState: roundType[]
	//add the type
	currentRound: { player1: move | undefined; player2: move | undefined; };

	constructor(gameID: string) {
		this.isFull = false;
		this.gameID = gameID;
		this.currentRound = {
			player1: undefined,
			player2: undefined
		}
		this.gameCards = {
			player1Deck: undefined,
			player2Deck: undefined,
			player1Hand: undefined,
			player2Hand: undefined,
		}
		this.gameState = []
	}

	joinGame(socketID: string) {
		this.player1SocketID = socketID;
	}

	dealHand(player: playerEnum) {
		//draw 4 unique cards
		let cardHand: number[] = []
		let isUnique = false
		for (let i = 0; i < 4; i++) {
			let selectedCard = getRandom(0, 15)

			while (cardHand.includes(selectedCard)) {
				selectedCard = getRandom(0, 15)
			}

			cardHand.push(selectedCard);
		}

		if (player == playerEnum.player1) this.gameCards.player1Hand = cardHand
		if (player == playerEnum.player2) this.gameCards.player2Hand = cardHand
	}

	addPlayer(socketID: string) {
		this.player2SocketID = socketID;
		this.isFull = true;
	}

	checkPlayer(socketID: string) {
		if (socketID == this.player1SocketID) {
			return playerEnum.player1;
		} else if (socketID == this.player2SocketID) {
			return playerEnum.player2;
		} else {
			return playerEnum.notPlayer;
		}
	}

	otherPlayer(player: playerEnum) {
		if (player == playerEnum.player1) {
			return this.player2SocketID
		}
		else if (player == playerEnum.player2) {
			return this.player1SocketID
		}
		else {
			throw new Error('input enum is not player 1 or 2')
		}
	}

	chooseMap() { }

	chooseDeck() { }

	startRound() { }
}
