import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { incrementTime } from "../features/boardSlice";
import type { RootState } from "../app/store";

interface TimerProps {
  direction: "left" | "right";
}

function Timer({ direction }: TimerProps) {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.board.time);
  const gameStarted = useSelector(
    (state: RootState) => state.board.gameStarted
  );

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      dispatch(incrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch, gameStarted]);

  const formattedTime = String(time).padStart(3, "0");

  const getDigitImage = (digit: string) =>
    `https://freeminesweeper.org/images/time${digit}.gif`;

  if (direction === "left") {
    return (
      <div className="left-timer">
        <img
          src={getDigitImage("0")}
          alt={`Digit ${0}`}
          style={{ width: "13px", height: "23px" }}
        />
        <img
          src={getDigitImage("0")}
          alt={`Digit ${0}`}
          style={{ width: "13px", height: "23px" }}
        />
        <img
          src={getDigitImage("0")}
          alt={`Digit ${0}`}
          style={{ width: "13px", height: "23px" }}
        />
      </div>
    );
  }

  return (
    <div className="timer">
      {formattedTime.split("").map((digit, index) => (
        <img
          key={index}
          src={getDigitImage(digit)}
          alt={`Digit ${digit}`}
          style={{ width: "13px", height: "23px" }}
        />
      ))}
    </div>
  );
}

export default Timer;
