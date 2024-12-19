import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setBoard,
  revealCell,
  toggleFlag,
  setGameStatus,
  revealAllMines,
  setMousePressed,
} from "../features/boardSlice";
import Cell from "./Cell";
import type { RootState } from "../app/store";

function Board() {
  const dispatch = useDispatch();
  const { board, rows, cols, gameStatus } = useSelector(
    (state: RootState) => state.board
  );

  useEffect(() => {
    const createBoard = (rows: number, cols: number) => {
      return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestioned: false,
          adjacentMines: 0,
        }))
      );
    };

    dispatch(setBoard(createBoard(rows, cols)));
  }, [dispatch, rows, cols]);

  const handleCellMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && gameStatus === "playing") {
      dispatch(setMousePressed(true));
    }
  };

  const handleCellMouseUp = (e: React.MouseEvent, row: number, col: number) => {
    if (e.button === 0 && gameStatus === "playing") {
      dispatch(setMousePressed(false));
      const clickedCell = board[row][col];
      if (!clickedCell.isFlagged && !clickedCell.isQuestioned) {
        dispatch(revealCell({ row, col }));
        if (clickedCell.isMine) {
          dispatch(setGameStatus("lost"));
          dispatch(revealAllMines());
        }
      }
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameStatus === "playing") {
      dispatch(toggleFlag({ row, col }));
    }
  };

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              cell={cell}
              onMouseDown={(e) => handleCellMouseDown(e)}
              onMouseUp={(e) => handleCellMouseUp(e, rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default React.memo(Board);
