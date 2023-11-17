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
	}

	joinGame(socketID) {
		this.player1 = socketID;
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

	chooseMap() {}

	chooseDeck() {}

	startRound() {}
}
