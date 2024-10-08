// src/Maze.js

import React, { useEffect, useState } from "react";
import "./Maze.css";

const Maze = () => {
  // Maze with start at bottom-left and end at top-right
  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],  // End at (0, 9)
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],  // Start at (9, 0)
  ];

  // Define halt cells and their questions
  const haltCells = {
    '2, 4': {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      answer: 2, // Index of the correct answer
    },
    '4, 6': {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      answer: 1,
    },
  };

  // Player's initial position at bottom-left (9, 0)
  const [playerPosition, setPlayerPosition] = useState({ row: 9, col: 0 });
  const [question, setQuestion] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  
  // Function to handle keypress and move player
  const handleKeyPress = (e) => {
    if (gameOver) return; // Prevent movement if game is over

    const { row, col } = playerPosition;
    
    switch (e.key) {
      case 'w': // Move up
        if (row > 0 && maze[row - 1][col] !== 1) {
          movePlayer(row - 1, col);
        }
        break;
      case 'a': // Move left
        if (col > 0 && maze[row][col - 1] !== 1) {
          movePlayer(row, col - 1);
        }
        break;
      case 's': // Move down
        if (row < maze.length - 1 && maze[row + 1][col] !== 1) {
          movePlayer(row + 1, col);
        }
        break;
      case 'd': // Move right
        if (col < maze[0].length - 1 && maze[row][col + 1] !== 1) {
          movePlayer(row, col + 1);
        }
        break;
      default:
        break;
    }
  };

  const movePlayer = (newRow, newCol) => {
    const cellKey = `${newRow}, ${newCol}`;
    if (haltCells[cellKey]) {
      setQuestion(haltCells[cellKey]);
    } else {
      setPlayerPosition({ row: newRow, col: newCol });
    }
  };

  const handleAnswer = (index) => {
    if (index === question.answer) {
      // Correct answer, proceed
      setPlayerPosition({ row: playerPosition.row + (question.rowOffset || 0), col: playerPosition.col + (question.colOffset || 0) });
      setQuestion(null);
    } else {
      // Incorrect answer, game over
      setGameOver(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [playerPosition, gameOver]);

  return (
    <div className="maze-container">
      {maze.map((row, rowIndex) => (
        <div className="maze-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`maze-cell ${cell === 1 ? "wall" : "path"}`}
            >
              {/* Render the player at the correct position */}
              {playerPosition.row === rowIndex && playerPosition.col === colIndex && (
                <div className="player"></div>
              )}
            </div>
          ))}
        </div>
      ))}
      {question && (
        <div className="question-popup">
          <h2>{question.question}</h2>
          {question.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(index)}>
              {option}
            </button>
          ))}
        </div>
      )}
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default Maze;
