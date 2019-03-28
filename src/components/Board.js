import React from 'react';
import '../styles.css';
import calculateWinner from './CalculateWinner';

function useToggle(initialState = false) {
  const [state, setState] = React.useState(initialState);
  //const toggle = React.useCallback(() => setState(s => !s))
  const toggle = () => setState(s => !s);
  return [state, toggle];
}

//Reducer hook allow you to abstract functionality out of the component
//Now any state change will occur in this function, allowing easier debugging
function gameReducer(state, action) {
  const { squares, xIsNext } = state;

  switch (action.type) {
    case 'SELECT_SQUARE': {
      const { square } = action;
      const winner = calculateWinner(squares);
      if (winner || squares[square]) {
        return state;
      }

      const squaresCopy = [...squares];
      squaresCopy[square] = xIsNext ? 'X' : 'O';
      return {
        squares: squaresCopy,
        xIsNext: !xIsNext
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function Board() {
  const [state, dispatch] = React.useReducer(gameReducer, {
    squares: Array(9).fill(null),
    xIsNext: true
  });
  const { squares, xIsNext } = state;
  const winner = calculateWinner(squares);

  function renderSquare(index) {
    return (
      <button className="square" onClick={() => selectSquare(index)}>
        {squares[index]}
      </button>
    );
  }

  function selectSquare(square) {
    dispatch({ type: 'SELECT_SQUARE', square });
  }

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(s => Boolean(s))) {
    status = `Scratch: Cat's game`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    //it is not that repetition is bad, but complexity is. In this case, what is happening is clear
    //However, there is greater potential for error. Bad bugs happen if we misnumber a square. Refactor.
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

export default Board;
