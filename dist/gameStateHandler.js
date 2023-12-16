import { getRandom } from "./libtools.js";
import * as totalCards from "./assets/cards.json" assert { type: "json" };
import * as totalMaps from "./assets/maps.json" assert { type: "json" };
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
            player2: undefined,
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
        //@ts-ignore
        this.mapState = totalMaps.default.maps[0].data;
        this.matchHistory = {
            player1Name: undefined,
            player2Name: undefined,
            selectedMap: undefined,
            player1Deck: [],
            player2Deck: [],
            player1StartingHand: [],
            player2StartingHand: [],
            game: [],
        };
    }
    joinGame(socketID) {
        this.player1SocketID = socketID;
    }
    dealHand(player) {
        //draw 4 unique cards
        let cardHand = [];
        for (let i = 0; i < 4; i++) {
            let selectedCard = getRandom(0, 14);
            while (cardHand.includes(selectedCard)) {
                selectedCard = getRandom(0, 14);
            }
            cardHand.push(selectedCard);
            //I think there might be a better way to do this,
            //currently we are using the index of the user's card hand
            //instead of the total card hands
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
            throw new Error("input enum is not player 1 or 2");
        }
    }
    setupGame() {
        this.matchHistory.player1Name = this.player1SocketID;
        this.matchHistory.player2Name = this.player2SocketID;
        this.matchHistory.selectedMap = 0;
        this.gameCards.player1Deck = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        ];
        this.gameCards.player2Deck = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
        ];
    }
    updateState() {
        console.log('point1');
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
        console.log('point2');
        if (this.gameCards.player1Hand == undefined)
            return;
        if (this.gameCards.player2Hand == undefined)
            return;
        const cardHandIndexPlayer1 = this.gameCards.player1Hand.findIndex(value => value == player1CardID);
        const cardHandIndexPlayer2 = this.gameCards.player2Hand.findIndex(value => value == player2CardID);
        console.log('point3', player1CardID, player2CardID);
        console.log(this.gameCards.player1Hand, this.gameCards.player2Hand);
        if (cardHandIndexPlayer1 == -1)
            return;
        if (cardHandIndexPlayer2 == -1)
            return;
        console.log('point4');
        let preRound = {
            player1Hand: this.gameCards.player1Hand,
            player2Hand: this.gameCards.player2Hand,
        };
        let newCardPlayer1 = this.getNewCard(playerEnum.player1, cardHandIndexPlayer1, this.gameCards.player1Hand);
        let newCardPlayer2 = this.getNewCard(playerEnum.player2, cardHandIndexPlayer2, this.gameCards.player2Hand);
        let round = {
            preRound: preRound,
            player1Move: this.currentRound.player1,
            player2Move: this.currentRound.player2,
            postRound: {
                mapState: this.mapState,
                dealtCards: {
                    player1: newCardPlayer1,
                    player2: newCardPlayer2,
                },
                score: {
                    player1: this.player1Score,
                    player2: this.player2Score,
                },
            },
        };
        this.matchHistory.game.push(round);
        return {
            player1: newCardPlayer1,
            player2: newCardPlayer2,
        };
    }
    getNewCard(player, index, cardHand) {
        let selectedCard = getRandom(0, 14);
        cardHand[index] = -1;
        while (cardHand.includes(selectedCard)) {
            selectedCard = getRandom(0, 14);
        }
        console.log(selectedCard, index);
        console.log(cardHand);
        cardHand[index] = selectedCard;
        if (player == playerEnum.player1) {
            this.gameCards.player1Hand = cardHand;
        }
        if (player == playerEnum.player2) {
            this.gameCards.player2Hand = cardHand;
        }
        return selectedCard;
    }
    chooseMap() { }
    chooseDeck() { }
    startRound() { }
}
