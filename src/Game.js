import React, { useEffect, useReducer, useState } from 'react';

const visitors = (state, action) => ({
  countdown: (state, action) => ({ ...state, countdown: action.payload })
});
const reducer = (state, action) => visitors[action.type](state, action);
const Game = () => {
  const playfield = [...Array(40)].map(() => [...Array(10)].map(() => false));
  const [state, dispatch] = useReducer(reducer, {
    countdown: 0
  });
  const [countdown, setCountdown] = useState(0);
  const play = () => {
    setCountdown(3);
    setTimeout(() => setCountdown(2), 1000);
    setTimeout(() => setCountdown(1), 2000);
    setTimeout(() => setCountdown(0), 3000);
  };
  useEffect(() => {}, [state.countdown]);
  return (
    <>
      <div data-testid="playfield">
        {playfield.map((row, i) => (
          <div key={i}>
            (
            {row.map((occupied, j) => (
              <div key={j}></div>
            ))}
            )
          </div>
        ))}
      </div>
      {countdown === 0 ? null : (
        <div className="countdown" data-testid="countdown">
          {countdown}
        </div>
      )}
      <button onClick={play}>PLAY</button>
    </>
  );
};

export default Game;
