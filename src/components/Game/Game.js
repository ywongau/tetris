import React from 'react';
import { phases } from '../../constants/phases';

const Game = (customHook) => () => {
  const { state, start, resume } = customHook();
  const getTetrominoBlock = (tetromino, x, y) =>
    tetromino && tetromino.shape[y - tetromino.top]?.[x - tetromino.left];
  return (
    <>
      <aside className="frame">
        <section>
          <h1>HOLD</h1>
          <div className="frame-content hold">
            <div className="small-tetromino">
              {state?.hold?.shape?.map((row, y) => (
                <div key={y} className="row">
                  {row.map((block, x) => (
                    <div className={block} key={x}></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>
      <main className="frame">
        <div data-testid="playfield" className="playfield frame-content">
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
            <button onClick={start}>START</button>
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
      <aside className="frame">
        <section>
          <h1>NEXT</h1>
          <div className="frame-content next-tetrominos">
            {state.queue.slice(0, 3).map((tetromino, i) => (
              <div className="small-tetromino" key={i}>
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
        </section>
        <section>
          <h1>LINES</h1>
          <div className="frame-content lines">{state.lines}</div>
        </section>
      </aside>
    </>
  );
};

export default Game;
