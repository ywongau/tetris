import { alive, landed, lock } from '../../engine/checks';
import {
  directions,
  move,
  rotateLeft,
  rotateRight
} from '../../engine/actions';

import { clearLines } from '../../engine/clearLines';

export const phases = {
  spawning: 'spawning',
  descending: 'descending',
  locking: 'locking',
  clearing: 'clearing'
};

const doLock = (state) => {
  if (state.phase !== phases.descending && state.phase !== phases.locking)
    return state;
  const { tetromino, playfield } = state;
  const lockResult = lock(tetromino, playfield);
  return lockResult.locked
    ? {
        ...state,
        tetromino: undefined,
        playfield: lockResult.playfield,
        phase: phases.clearing
      }
    : {
        ...state,
        phase: phases.descending
      };
};

const visitors = {
  tick: (state) => {
    if (state.phase !== phases.descending) return state;
    const { tetromino, playfield } = state;
    const updatedTetromino = move(tetromino, playfield, directions.down);
    return {
      ...state,
      tetromino: updatedTetromino,
      phase: landed(updatedTetromino, playfield)
        ? phases.locking
        : phases.descending
    };
  },
  move: (state, action) => {
    if (state.phase !== phases.descending && state.phase !== phases.locking)
      return state;
    const { tetromino, playfield } = state;
    const updatedTetromino = move(tetromino, playfield, action.payload);
    return state.phase === phases.locking && action.payload === directions.down
      ? doLock(state)
      : {
          ...state,
          tetromino: updatedTetromino,
          phase:
            action.payload === directions.down &&
            landed(updatedTetromino, playfield)
              ? phases.locking
              : phases.descending
        };
  },
  lock: doLock,
  clear: (state) => {
    const { playfield } = state;
    const clearResult = clearLines(playfield);
    const lines = state.lines + clearResult.linesCleared;
    return state.phase === phases.clearing
      ? {
          ...state,
          playfield: clearResult.playfield,
          lines,
          interval: Math.max(200, 1000 - Math.floor(lines / 10) * 50),
          phase: phases.spawning
        }
      : state;
  },
  rotateRight: (state) => {
    if (state.phase !== phases.descending && state.phase !== phases.locking)
      return state;
    const { tetromino, playfield } = state;
    return {
      ...state,
      tetromino: rotateRight(tetromino, playfield)
    };
  },
  rotateLeft: (state) => {
    if (state.phase !== phases.descending && state.phase !== phases.locking)
      return state;
    const { tetromino, playfield } = state;
    return {
      ...state,
      tetromino: rotateLeft(tetromino, playfield)
    };
  },
  spawn: (state, action) => {
    const { queue, playfield } = state;
    const newTetromino = queue[0];
    const newQueue = queue.slice(1).concat(action.payload || []);
    return {
      ...state,
      tetromino: newTetromino,
      phase: phases.descending,
      queue: newQueue,
      alive: alive(newTetromino, playfield)
    };
  }
};
export const reducer = (state, action) => visitors[action.type](state, action);
