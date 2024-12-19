### How to Start

```tsx
yarn install
yarn start
```

## 1. **양쪽 클릭 기능 (Area Open)**

```tsx
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
```

- 클릭한 셀이 빈 칸이면 주변 빈 셀을 드러냄
- BFS를 사용해 반복문으로 탐색
- 경계 체크 및 드러난 상태 확인 후 셀을 드러냄

## 2. **렌더링 최적화**

```tsx
import React from "react";

const Cell = ({ cell, onClick, onContextMenu }: CellProps) => {
  const cellStyle: React.CSSProperties = {
    width: "30px",
    height: "30px",
    border: "1px solid black",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "30px",
    backgroundColor: cell.isRevealed ? (cell.isMine ? "red" : "#ddd") : "#bbb",
    color: cell.isMine ? "white" : "black",
    fontWeight: "bold",
  };

  return (
    <div style={cellStyle} onClick={onClick} onContextMenu={onContextMenu}>
      {cell.isRevealed
        ? cell.isMine
          ? "💣"
          : cell.adjacentMines || ""
        : cell.isFlagged
        ? "🚩"
        : ""}
    </div>
  );
};

export default React.memo(Cell);
```

- `React.memo`를 사용하여 `Cell` 컴포넌트를 메모이제이션.
- 동일한 `props`일 경우 불필요한 리렌더링 방지.

## 3. **난이도 데이터 저장 (브라우저 새로고침 시 유지)**

```tsx
import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/boardSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "board",
  storage,
  whitelist: ["difficulty", "rows", "cols", "mines"],
};

const persistedReducer = persistReducer(persistConfig, boardReducer);

export const store = configureStore({
  reducer: {
    board: persistedReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- **Redux Persist** 라이브러리를 활용해 게임 설정 상태 저장
- `storage`에 `difficulty`, `rows`, `cols`, `mines` 상태를 저장 및 복원
- 브라우저 새로고침 후에도 게임 상태 유지
