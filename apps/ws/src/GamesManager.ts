import { CLOSING, WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Games";

export default class GamesManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  addUser(socket: WebSocket) {
    console.log("user is added")
    this.users.push(socket);
    this.addHandler(socket);
  }

  removeUser(socket: WebSocket) {
    this.users = this.users.filter((user) => user !== socket);        
    // Stop the game here because user is left
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          // Start a game
          const game = new Game(this.pendingUser, socket);
          this.games.push(game);
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }
      if(message.type === MOVE){
        console.log("mssg type is move, mssg: ", message);
        const game = this.games.find(game=> game.player1===socket || game.player2===socket)
        if(game){
          console.log("calling makemove with move: ", message.payload.move);
            game.makeMove(socket, message.payload.move)
        }
      }
    });
  }
}
