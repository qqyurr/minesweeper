import React from "react";

interface CellProps {
  cell: {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    isQuestioned: boolean;
    adjacentMines: number;
  };
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function Cell({ cell, onMouseDown, onMouseUp, onContextMenu }: CellProps) {
  const cellStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    border: "1px solid black",
    display: "inline-block",
    textAlign: "center",
    lineHeight: "16px",
    backgroundColor: cell.isRevealed ? (cell.isMine ? "red" : "#ddd") : "#bbb",
    color: cell.isMine ? "white" : "black",
    fontWeight: "bold",
    fontFamily: "Tahoma",
    fontSize: "11px",
  };

  return (
    <div
      style={cellStyle}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onContextMenu={onContextMenu}
    >
      {cell.isRevealed
        ? cell.isMine
          ? "💣"
          : cell.adjacentMines || ""
        : cell.isFlagged
        ? "🚩"
        : cell.isQuestioned
        ? "?"
        : ""}
    </div>
  );
}

export default React.memo(Cell);
