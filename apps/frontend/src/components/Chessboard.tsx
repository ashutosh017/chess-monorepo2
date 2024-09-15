import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const Chessboard = ({
  chess,
  setBoard,
  board,
  socket,
  color,
}: {
  chess: any;
  setBoard: any;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
  color: string;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  // const[to, setTo] = useState<null| Square>(null)
  let reverseBoard = [...board].reverse();
  console.log("board:",board);
  console.log("reverseBoard:",reverseBoard);
  return (
    <div>
      <div className="">
        {`You are: ${color}`}
        {color==='black'?
        <div>
        {reverseBoard.map((row, i) => (
            <div key={i} className="flex">
              {[...row].reverse().map((square, j) => {
                return (
                  <div
                    key={j}
                    onClick={() => {
                      const clickedSquare = (String.fromCharCode(97 +7 -j) +
                        String.fromCharCode(49 + i)) as Square;
                      console.log("You clicked on: ", clickedSquare);
                      if (!from) {
                        setFrom(clickedSquare);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: clickedSquare,
                              },
                            },
                          })
                        );
                        setFrom(null);
                        chess.move({
                          from,
                          to: clickedSquare,
                        });
                        setBoard(chess.board());
                        console.log("from and to: ", {
                          from,
                          to: clickedSquare,
                        });
                      }
                    }}
                    className={`w-12 h-12 sm:w-20 sm:h-20 ${(i + j) % 2 == 1 ? "bg-green-600" : "bg-white"} flex justify-center items-center text-black`}
                  >
                    {square ? (
                      <img
                        className="w-12 sm:w-20"
                        // src={`/${square.color==='w'?'b':'w'}${square.type==='k'?'q':square.type==='q'?'k':square.type}.png`}
                        src={`/${square.color}${square.type}.png`}
                      />
                    ) : (
                      ""
                    )}
                    {/* {square?.color};
                    {square?.square};
                    {square?.type} */}
                  </div>
                );
              })}
            </div>
        ))}
        </div>:<div>
        {board.map((row, i) => (
            <div key={i} className="flex">
              {row.map((square, j) => {
                return (
                  <div
                    key={j}
                    onClick={() => {
                      const clickedSquare = (String.fromCharCode(97 + j) +
                        String.fromCharCode(48 +8-i)) as Square;
                      console.log("You clicked on: ", clickedSquare);
                      if (!from) {
                        setFrom(clickedSquare);
                      } else {
                        socket.send(
                          JSON.stringify({
                            type: MOVE,
                            payload: {
                              move: {
                                from,
                                to: clickedSquare,
                              },
                            },
                          })
                        );
                        setFrom(null);
                        chess.move({
                          from,
                          to: clickedSquare,
                        });
                        setBoard(chess.board());
                        console.log("from and to: ", {
                          from,
                          to: clickedSquare,
                        });
                      }
                    }}
                    className={`w-12 h-12 sm:w-20 sm:h-20 ${(i + j) % 2 == 1 ? "bg-green-600" : "bg-white"} flex justify-center items-center text-black`}
                  >
                    {square ? (
                      <img
                        className="w-12 sm:w-20"
                        src={`/${square.color}${square.type}.png`}
                      />
                    ) : (
                      ""
                    )}
                    {/* {square?.color};
                    {square?.square};
                    {square?.type} */}
                  </div>
                );
              })}
            </div>
        ))}
        </div>
}
      </div>
    </div>
  );
};
