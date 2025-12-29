import { useState } from "react";

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={ onSquareClick }>
    { value }
  </button>;
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i])
      return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  const rows = Array.from({ length: 3 });

  return (
    <>
      <div className="status">{ status }</div>
      { rows.map((_, rowNum) => (
        <div key={ rowNum } className="board-row">
          { Array.from({ length: 3 }).map((_, colNum) => (
            <Square key={ 3*rowNum+colNum } value={ squares[3*rowNum+colNum] } onSquareClick={ () => handleClick(3*rowNum+colNum) } />
          )) }
        </div>
      )) }
    </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {

    switch (move) {
      case 0: 
        return (<li key={ move }><button onClick={() => jumpTo(move)}>Go to game start</button></li>);
      case currentMove: 
        return (<li key={ move }>You are at move #{ move }</li>);
      default:
        return (<li key={ move }><button onClick={() => jumpTo(move)}>Go to move #{ move }</button></li>);
    }

  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={ xIsNext } squares={ currentSquares } onPlay={ handlePlay } />
      </div>
      <div className="game-info">
        <ol>{ moves }</ol>
      </div>
    </div>
  )

}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }    
  return null;
}
