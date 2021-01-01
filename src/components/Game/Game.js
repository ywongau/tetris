import React from 'react';
import { phases } from './reducer';

const Game = (customHook) => () => {
  const { state, start, resume } = customHook();
  const getTetrominoBlock = (tetromino, x, y) =>
    tetromino && tetromino.shape[y - tetromino.top]?.[x - tetromino.left];
  return (
    <>
      <main className="frame">
        <div data-testid="playfield" className="playfield">
          {state.playfield.map((row, y) => (
            <div
              key={y}
              className={
                'row' +
                (state.phase === 'clearing' && row.every((x) => x)
                  ? ' clearing'
                  : '')
              }
            >
              {row.map((block, x) => (
                <div
                  key={x}
                  className={
                    getTetrominoBlock(state.tetromino, x, y) ||
                    (getTetrominoBlock(state.ghostPiece, x, y)
                      ? 'ghost-piece'
                      : '') ||
                    block ||
                    ''
                  }
                />
              ))}
            </div>
          ))}
        </div>
        {state.phase === phases.pending || state.phase === phases.gameOver ? (
          <div className="controls">
            <button onClick={start}>PLAY</button>
          </div>
        ) : null}
        {state.phase === phases.paused ? (
          <div className="controls">
            <button onClick={resume}>RESUME</button>
          </div>
        ) : null}

        {state.countdown > 0 ? (
          <div className="countdown">{state.countdown}</div>
        ) : null}
      </main>
      <div className="frame">
        <h1>NEXT</h1>
        <div className="next-tetrominoes">
          {state.queue.slice(0, 3).map((tetromino, i) => (
            <div className="next-tetromino" key={i}>
              {tetromino.shape.map((row, y) => (
                <div key={y} className="row">
                  {row.map((block, x) => (
                    <div className={block} key={x}></div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <h1>LINES</h1>
        <div className="lines">{state.lines}</div>
      </div>
    </>
  );
};

export default Game;
