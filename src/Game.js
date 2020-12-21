import React, { useEffect, useReducer, useState } from 'react';
import { directions, move } from './engine/actions';

import { lock } from './engine/lock';
import { randomizer } from './engine/randomizer';

const visitors = (state, action) => ({
  tick: (state, action) => {
        return ({ ...state, countdown: action.payload });
    }
});
const reducer = (state, action) => visitors[action.type](state, action);
const Game = () => {
  const [playfield, setPlayfield] = useState(() =>
    [...Array(20)].map(() => [...Array(10)].map(() => false))
  );
  const [randomQueue, setRandomQueue] = useState(() => randomizer());
  const [countdown, setCountdown] = useState(0);
  const [tetromino, setTetromino] = useState();

  useEffect(() => {
    if (tetromino) {
      setTimeout(() => {
        const updatedTetromino = move(tetromino, playfield, directions.down);
        console.log('tick', tetromino.top);
        const lockResult = lock(updatedTetromino, playfield);
        if (lockResult.locked) {
          setTetromino(undefined);
          setPlayfield(lockResult.playfield);
        } else {
          setTetromino(updatedTetromino);
        }
      }, 1000);
    } else {
      setTimeout(() => {
        const nextTetromino = randomQueue[0];
        setRandomQueue(randomQueue.slice(1));
        setTetromino(nextTetromino);
      });
    }
  }, [tetromino]);

  useEffect(() => {
    document.body.addEventListener('keydown', (e) => {
      console.log(e);
      const updatedTetromino = move(tetromino, playfield, e.keyCode);
      setTetromino(updatedTetromino);
    });
  }, []);
  //   const play = () => {
  //     setCountdown(3);
  //     setTimeout(() => setCountdown(2), 1000);
  //     setTimeout(() => setCountdown(1), 2000);
  //     setTimeout(() => {
  //       setCountdown(0);
  //       const nextTetromino = randomQueue[0];
  //       setRandomQueue(randomQueue.slice(1));
  //       setTetromino(nextTetromino);
  //     }, 3000);
  //   };
  console.log('render', tetromino?.top);
  return (
    <>
      <div data-testid="playfield">
        {playfield.map((row, y) => (
          <div key={y} className="row">
            {row.map((occupied, x) => (
              <div
                key={x}
                className={
                  tetromino?.shape?.[y - tetromino.top]?.[
                    x - tetromino?.left
                  ] ||
                  playfield[y]?.[x] ||
                  ''
                }
              />
            ))}
          </div>
        ))}
      </div>
      {/* {countdown === 0 ? null : (
        <div className="countdown" data-testid="countdown">
          {countdown}
        </div>
      )}
      <button onClick={play}>PLAY</button> */}
    </>
  );
};

export default Game;
