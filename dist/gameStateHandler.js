import { getRandom } from './libtools.js';
import * as totalCards from './assets/cards.json' assert { type: 'json' };
export var playerEnum;
(function (playerEnum) {
    playerEnum[playerEnum["player1"] = 0] = "player1";
    playerEnum[playerEnum["player2"] = 1] = "player2";
    playerEnum[playerEnum["notPlayer"] = 2] = "notPlayer";
})(playerEnum || (playerEnum = {}));
export class gameStateHandler {
    constructor(gameID) {
        this.isFull = false;
        this.gameID = gameID;
        this.currentRound = {
            player1: undefined,
            player2: undefined
        };
        this.gameCards = {
            player1Deck: undefined,
            player2Deck: undefined,
            player1Hand: undefined,
            player2Hand: undefined,
        };
        this.gameState = [];
        this.player1Score = 0;
        this.player2Score = 0;
    }
    joinGame(socketID) {
        this.player1SocketID = socketID;
    }
    dealHand(player) {
        //draw 4 unique cards
        let cardHand = [];
        let isUnique = false;
        for (let i = 0; i < 4; i++) {
            let selectedCard = getRandom(0, 15);
            while (cardHand.includes(selectedCard)) {
                selectedCard = getRandom(0, 15);
            }
            cardHand.push(selectedCard);
        }
        if (player == playerEnum.player1)
            this.gameCards.player1Hand = cardHand;
        if (player == playerEnum.player2)
            this.gameCards.player2Hand = cardHand;
    }
    addPlayer(socketID) {
        this.player2SocketID = socketID;
        this.isFull = true;
    }
    checkPlayer(socketID) {
        if (socketID == this.player1SocketID) {
            return playerEnum.player1;
        }
        else if (socketID == this.player2SocketID) {
            return playerEnum.player2;
        }
        else {
            return playerEnum.notPlayer;
        }
    }
    otherPlayer(player) {
        if (player == playerEnum.player1) {
            return this.player2SocketID;
        }
        else if (player == playerEnum.player2) {
            return this.player1SocketID;
        }
        else {
            throw new Error('input enum is not player 1 or 2');
        }
    }
    updateScores() {
        if (this.currentRound.player1 == undefined)
            return;
        if (this.currentRound.player2 == undefined)
            return;
        let player1CardID = this.currentRound.player1.cardID;
        let player2CardID = this.currentRound.player2.cardID;
        //@ts-ignore
        this.player1Score += totalCards.default.cards[player1CardID].cardCells;
        //@ts-ignore
        this.player2Score += totalCards.default.cards[player2CardID].cardCells;
    }
    chooseMap() { }
    chooseDeck() { }
    startRound() { }
}
