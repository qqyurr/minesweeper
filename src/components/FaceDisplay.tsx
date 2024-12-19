import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { restartGame } from "../features/boardSlice";
import type { RootState } from "../app/store";

function FaceDisplay() {
  const gameStatus = useSelector((state: RootState) => state.board.gameStatus);
  const isMousePressed = useSelector(
    (state: RootState) => state.board.isMousePressed
  );
  const dispatch = useDispatch();

  const resetGame = () => {
    dispatch(restartGame());
  };

  let faceImg = "https://freeminesweeper.org/images/facesmile.gif";

  if (gameStatus === "lost") {
    faceImg = "https://freeminesweeper.org/images/facedead.gif";
  } else if (isMousePressed) {
    faceImg = "https://freeminesweeper.org/images/faceooh.gif";
  }

  return (
    <img
      width={26}
      height={26}
      onClick={resetGame}
      className="face-display"
      src={faceImg}
    />
  );
}

export default React.memo(FaceDisplay);
