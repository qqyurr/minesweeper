import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestioned: boolean;
  adjacentMines: number;
}

type BoardType = CellData[][];

interface BoardState {
  board: BoardType;
  rows: number;
  cols: number;
  mines: number;
  time: number;
  gameStarted: boolean;
  gameStatus: "playing" | "won" | "lost";
  isMousePressed: boolean;
  difficulty: string;
}

const initialState: BoardState = {
  board: [],
  rows: 8,
  cols: 8,
  mines: 10,
  time: 0,
  gameStarted: false,
  gameStatus: "playing",
  isMousePressed: false,
  difficulty: "Beginner",
};

// 방향 벡터를 상수로 정의
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const isWithinBounds = (row: number, col: number, rows: number, cols: number) =>
  row >= 0 && row < rows && col >= 0 && col < cols;

function placeMines(
  board: BoardType,
  mines: number,
  firstClick: { row: number; col: number }
) {
  const possiblePositions = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (row !== firstClick.row || col !== firstClick.col) {
        possiblePositions.push({ row, col });
      }
    }
  }

  for (let i = possiblePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [possiblePositions[i], possiblePositions[j]] = [
      possiblePositions[j],
      possiblePositions[i],
    ];
  }

  for (let i = 0; i < mines; i++) {
    const { row, col } = possiblePositions[i];
    board[row][col].isMine = true;

    DIRECTIONS.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isWithinBounds(newRow, newCol, board.length, board[0].length)) {
        board[newRow][newCol].adjacentMines += 1;
      }
    });
  }
}

// 빈 셀 공개 함수 (area open, BFS 사용)
const revealEmptyCells = (
  board: BoardType,
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  const stack = [{ row, col }];
  while (stack.length > 0) {
    const { row, col } = stack.pop()!;
    const cell = board[row][col];

    if (cell.isRevealed || cell.isMine || cell.isFlagged) continue;

    cell.isRevealed = true;

    if (cell.adjacentMines === 0) {
      DIRECTIONS.forEach(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
          isWithinBounds(newRow, newCol, rows, cols) &&
          !board[newRow][newCol].isRevealed
        ) {
          stack.push({ row: newRow, col: newCol });
        }
      });
    }
  }
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setDifficulty(
      state,
      action: PayloadAction<{
        rows: number;
        cols: number;
        mines: number;
        difficulty: string;
      }>
    ) {
      state.rows = action.payload.rows;
      state.cols = action.payload.cols;
      state.mines = action.payload.mines;
      state.gameStarted = false;
      state.time = 0;
      state.difficulty = action.payload.difficulty;
      state.gameStatus = "playing";
    },
    setMousePressed: (state, action: PayloadAction<boolean>) => {
      state.isMousePressed = action.payload;
    },
    setBoard: (state, action: PayloadAction<BoardType>) => {
      state.board = action.payload;
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload;
    },
    setGameStatus: (
      state,
      action: PayloadAction<"playing" | "won" | "lost">
    ) => {
      state.gameStatus = action.payload;
    },
    incrementTime: (state) => {
      if (state.gameStatus === "playing") {
        state.time += 1;
      }
    },
    revealAllMines: (state) => {
      state.board.forEach((row) =>
        row.forEach((cell) => {
          if (cell.isMine) {
            cell.isRevealed = true;
          }
        })
      );
    },
    revealCell: (
      state,
      action: PayloadAction<{ row: number; col: number }>
    ) => {
      const { row, col } = action.payload;
      if (!state.gameStarted) {
        placeMines(state.board, state.mines, { row, col });
        state.gameStarted = true;
      }
      revealEmptyCells(state.board, row, col, state.rows, state.cols);
    },
    toggleFlag: (
      state,
      action: PayloadAction<{ row: number; col: number }>
    ) => {
      const { row, col } = action.payload;
      const cell = state.board[row][col];
      if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
        cell.isQuestioned = !cell.isFlagged && !cell.isQuestioned;
      }
    },
    restartGame: (state) => {
      state.board = Array.from({ length: state.rows }, () =>
        Array.from({ length: state.cols }, () => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestioned: false,
          adjacentMines: 0,
        }))
      );
      state.time = 0;
      state.gameStarted = false;
      state.gameStatus = "playing";
    },
  },
});

export const {
  setBoard,
  setGameStarted,
  setGameStatus,
  incrementTime,
  revealAllMines,
  revealCell,
  toggleFlag,
  setDifficulty,
  setMousePressed,
  restartGame,
} = boardSlice.actions;
export default boardSlice.reducer;
