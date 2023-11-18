import { createServer } from "http";
import { Server } from "socket.io";
import { gameStateHandler } from "./gameStateHandler.js";
import chalk from "chalk";
import figlet from "figlet";
import gradient from "gradient-string";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
});

//let currentGames = [];
let currentGame;

io.on("connection", (socket) => {
	socket.on("joinRoom", (data) => {
		if (currentGame == undefined) {
			currentGame = new gameStateHandler(data.gameID);

			console.log(
				chalk.cyan("╭ "),
				chalk.hex("#1E1E2E").bgCyan("\ue0b0 created Game \ue0b2"),
				chalk.bold.cyan(data.gameID),
			);

			currentGame.joinGame(socket.id);
			socket.join(data.gameID);

			console.log(
				chalk.cyan("├─╴"),
				chalk.blueBright(socket.id, chalk.bold("joined")),
			);
		} else if (!currentGame.isFull) {
			currentGame.addPlayer(socket.id);
			socket.join(data.gameID);

			console.log(
				chalk.cyan("├─╴"),
				chalk.blueBright(socket.id, chalk.bold("joined")),
			);
			console.log(
				chalk.cyan("├─╴"),
				chalk.cyanBright("\ue0b6") +
					chalk.bgCyanBright.black.bold(" starting Game ") +
					chalk.bgGreen(chalk.cyan("\ue0b0")) +
					chalk.black.bold.bgGreen(" gameID:", data.gameID) +
					chalk.green("\ue0b4"),
			);
			console.log(
				chalk.cyan("├─╴"),
				chalk.blue.bold("selecting Map"),
				chalk.gray("skipping"),
			);
			console.log(
				chalk.cyan("├─╴"),
				chalk.blue.bold("selecting Decks"),
				chalk.gray("skipping"),
			);
			console.log(
				chalk.cyan("├─╴"),
				chalk.magenta("\ue0b6") +
					chalk.bgMagenta.black.bold(" GameStart! ") +
					chalk.magenta("\ue0b4"),
			);
			console.log(chalk.cyan('│'))

			io.sockets.in(data.gameID).emit("gameStart", {});
		} else {
			console.log(
				chalk.cyan("├─╴"),
				chalk.redBright(
					socket.id,
					"tried to join -",
					chalk.bold("refused, is full"),
				),
			);
		}
	});

	socket.on("playCard", (cardID, rotation, positionX, positionY) => {
		let player = currentGame.checkPlayer(socket.id)
		if (player == "neither") return
		if (currentGame.round[player] == undefined) {
			console.log(
				chalk.cyan("├─╴ "),
					chalk.bgYellow.black.bold(` ${player} played a card`) +
					chalk.yellow("\ue0b4"),
			);
			
			//TODO check valid placement
			let cardPlayed = {cardID: cardID, rotation:rotation, positionX:positionX, positionY:positionY}
			currentGame.round[player] = cardPlayed

		}

		if (currentGame.round['player1'] != undefined && currentGame.round['player2'] != undefined) {
			console.log(chalk.cyan('│'))
			console.log(
				chalk.cyan("├─╴"),
				chalk.magenta("\ue0b6") +
					chalk.bgMagenta.black.bold(` revealing cards - score [placeholder] - [placehodler] rounds left []`) +
					chalk.magenta("\ue0b4"),
			);

			io.to(currentGame.player1).emit('revealPlay', currentGame.round.player2)
			io.to(currentGame.player2).emit('revealPlay', currentGame.round.player1)

			currentGame.round = {
				player1: undefined,
				player2: undefined
			}

			console.log(chalk.cyan('│'))

			//TODO make it so rounds are in a list, then send the opponents card to them
		}
	});
});

console.clear();

let msg = `Turf Card Game`;

figlet(msg, (err, data) => {
	console.log(chalk.bold(gradient.teen.multiline(data)));
	console.log(chalk.bold(gradient.teen("\t listening on localhost:3002\n")));
});

httpServer.listen(3002);
