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
  clearing: 'clearing',
  gameOver: 'gameOver'
};

const doLock = (state) => {
  const { tetromino, playfield } = state;
  const lockResult = lock(tetromino, playfield);
  return lockResult.locked
    ? {
        ...state,
        tetromino: undefined,
        playfield: lockResult.playfield,
        sfx: 'locked',
        phase: phases.clearing
      }
    : {
        ...state,
        phase: phases.descending
      };
};

const visitors = {
  tick: (state) => {
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
    const { tetromino, playfield } = state;
    const updatedTetromino = move(tetromino, playfield, action.payload);
    return state.phase === phases.locking && action.payload === directions.down
      ? doLock(state)
      : {
          ...state,
          tetromino: updatedTetromino,
          phase: landed(updatedTetromino, playfield)
            ? phases.locking
            : phases.descending
        };
  },
  lock: doLock,
  clear: (state) => {
    const { playfield } = state;
    const clearResult = clearLines(playfield);
    const lines = state.lines + clearResult.linesCleared;
    return {
      ...state,
      playfield: clearResult.playfield,
      lines,
      sfx:
        clearResult.linesCleared > 0
          ? 'clear' + clearResult.linesCleared
          : undefined,
      interval: Math.max(100, 1000 - Math.floor(lines / 10) * 50),
      phase: phases.spawning
    };
  },
  rotateRight: (state) => {
    const { tetromino, playfield } = state;
    return {
      ...state,
      tetromino: rotateRight(tetromino, playfield)
    };
  },
  rotateLeft: (state) => {
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
    const isAlive = alive(newTetromino, playfield);
    return {
      ...state,
      tetromino: newTetromino,
      phase: isAlive ? phases.descending : phases.gameOver,
      sfx: isAlive ? 'spawn' : 'gameOver',
      queue: newQueue,
      alive: isAlive
    };
  }
};
const validPhases = {
  tick: [phases.descending, phases.locking],
  move: [phases.descending, phases.locking],
  lock: [phases.locking],
  clear: [phases.clearing],
  rotateLeft: [phases.descending, phases.locking],
  rotateRight: [phases.descending, phases.locking],
  spawn: [phases.spawning]
};
export const reducer = (state, action) =>
  validPhases[action.type]?.includes(state.phase)
    ? visitors[action.type](state, action)
    : state;