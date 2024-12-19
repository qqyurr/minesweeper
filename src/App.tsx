import React from "react";
import Board from "./components/Board";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import FaceDisplay from "./components/FaceDisplay";

function App() {
  return (
    <div className="app">
      <div className="container">
        <div className="menu">
          <Controls />
        </div>
        <div className="top-line">
          <Timer direction="left" />
          <FaceDisplay />
          <Timer direction="right" />
        </div>
        <Board />
      </div>
    </div>
  );
}

export default App;
