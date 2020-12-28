import React from 'react';

const Game = (customHook) => () => {
  const { state } = customHook();
  return (
    <>
      <div className="frame">
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
                    state.tetromino?.shape?.[y - state.tetromino.top]?.[
                      x - state.tetromino.left
                    ] ||
                    block ||
                    ''
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
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
