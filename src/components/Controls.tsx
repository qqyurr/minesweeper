import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setDifficulty } from "../features/boardSlice";

function Controls() {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customRows, setCustomRows] = useState(8);
  const [customCols, setCustomCols] = useState(8);
  const [customMines, setCustomMines] = useState(10);

  const [errorMessage, setErrorMessage] = useState("");

  const changeDifficulty = (
    rows: number,
    cols: number,
    mines: number,
    difficulty: string
  ) => {
    dispatch(setDifficulty({ rows, cols, mines, difficulty }));
    setIsDropdownOpen(false);
  };

  const handleCustomSubmit = () => {
    const maxMines = Math.floor((customRows * customCols) / 3);

    if (customRows < 1 || customRows > 100) {
      setErrorMessage("Rows must be between 1 and 100.");
      return;
    }

    if (customCols < 1 || customCols > 100) {
      setErrorMessage("Columns must be between 1 and 100.");
      return;
    }

    if (customMines < 1 || customMines > maxMines) {
      setErrorMessage(
        `Mines must be between 1 and ${maxMines} (1/3 of the grid size).`
      );
      return;
    }

    setErrorMessage(""); // Reset error message
    dispatch(
      setDifficulty({
        rows: customRows,
        cols: customCols,
        mines: customMines,
        difficulty: "Custom",
      })
    );
    setIsModalOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="controls">
      <button
        className="menu-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Menu
      </button>

      {isDropdownOpen && (
        <ul className="dropdown">
          <li onClick={() => changeDifficulty(8, 8, 10, "Beginner")}>
            Beginner
          </li>
          <li onClick={() => changeDifficulty(16, 16, 40, "Intermediate")}>
            Intermediate
          </li>
          <li onClick={() => changeDifficulty(16, 32, 100, "Expert")}>
            Expert
          </li>
          <li onClick={() => setIsModalOpen(true)}>Custom</li>
        </ul>
      )}

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Custom Difficulty</h3>
            <label>
              Rows
              <input
                type="number"
                value={customRows}
                onChange={(e) => setCustomRows(Number(e.target.value))}
                min={1}
                max={100}
              />
            </label>
            <label>
              Columns
              <input
                type="number"
                value={customCols}
                onChange={(e) => setCustomCols(Number(e.target.value))}
                min={1}
                max={100}
              />
            </label>
            <label>
              Mines
              <input
                type="number"
                value={customMines}
                onChange={(e) => setCustomMines(Number(e.target.value))}
                min={1}
                max={Math.floor((customRows * customCols) / 3)}
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-actions">
              <button onClick={handleCustomSubmit}>Submit</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(Controls);
