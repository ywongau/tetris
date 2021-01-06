import { blockedOut, landed } from '../../engine/checks';
import {
  hardDrop,
  lock,
  move,
  rotateLeft,
  rotateRight
} from '../../engine/actions';

import { clearLines } from '../../engine/clearLines';
import { directions } from '../../constants/directions';
import { lookup } from '../../constants/tetrominos';
import { phases } from '../../constants/phases';

const emptyPlayField = [...Array(22)].map(() =>
  [...Array(10)].map(() => undefined)
);
const doLock = (state) => {
  const { tetromino, playfield } = state;
  const lockResult = lock(tetromino, playfield);
  return lockResult.locked
    ? {
        ...state,
        tetromino: undefined,
        ghostPiece: undefined,
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
      phase: landed(updatedTetromino, playfield) ? phases.locking : state.phase
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
          ghostPiece: hardDrop(updatedTetromino, playfield),
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
      interval: Math.max(100, 1000 - Math.floor(lines / 10) * 100),
      phase: phases.spawning
    };
  },
  rotateRight: (state) => {
    const { tetromino, playfield } = state;
    const updatedTetromino = rotateRight(tetromino, playfield);
    return {
      ...state,
      tetromino: rotateRight(tetromino, playfield),
      ghostPiece: hardDrop(updatedTetromino, playfield)
    };
  },
  rotateLeft: (state) => {
    const { tetromino, playfield } = state;
    const updatedTetromino = rotateLeft(tetromino, playfield);
    return {
      ...state,
      tetromino: updatedTetromino,
      ghostPiece: hardDrop(updatedTetromino, playfield)
    };
  },
  spawn: (state, action) => {
    const { queue, playfield } = state;
    const newTetromino = queue[0];
    const newQueue = queue.slice(1).concat(action.payload || []);
    const isAlive =
      !landed(newTetromino, playfield) && !blockedOut(newTetromino, playfield);
    return {
      ...state,
      tetromino: newTetromino,
      ghostPiece: hardDrop(newTetromino, playfield),
      phase: isAlive ? phases.descending : phases.gameOver,
      sfx: isAlive ? 'spawn' : 'gameOver',
      queue: newQueue,
      holdLock: false,
      alive: isAlive
    };
  },
  hardDrop: (state) => {
    const { tetromino, playfield } = state;
    const updatedTetromino = hardDrop(tetromino, playfield);
    return doLock({
      ...state,
      tetromino: updatedTetromino,
      phase: phases.locking
    });
  },
  start: (state, action) => ({
    playfield: emptyPlayField,
    queue: action.payload,
    phase: phases.starting,
    tetromino: undefined,
    alive: true,
    interval: 1000,
    lines: 0,
    countdown: 3,
    originalPhase: undefined
  }),
  countdown: (state) => ({
    ...state,
    countdown: Math.max(0, state.countdown - 1)
  }),
  pause: (state) => ({
    ...state,
    phase: phases.paused,
    originalPhase: state.phase
  }),
  resume: (state) => ({
    ...state,
    phase: phases.resuming,
    countdown: 3
  }),
  restore: (state) => ({
    ...state,
    phase: state.originalPhase,
    originalPhase: undefined
  }),
  hold: (state) => {
    const tetromino = state.hold ?? state.queue[0];
    return state.holdLock
      ? state
      : {
          ...state,
          hold: lookup[state.tetromino.name],
          holdLock: true,
          tetromino,
          queue: state.hold ? state.queue : state.queue.slice(1),
          ghostPiece: hardDrop(tetromino, state.playfield)
        };
  }
};
const validPhases = {
  tick: [phases.descending],
  move: [phases.descending, phases.locking],
  lock: [phases.locking],
  clear: [phases.clearing],
  rotateLeft: [phases.descending, phases.locking],
  rotateRight: [phases.descending, phases.locking],
  spawn: [phases.spawning, phases.starting],
  hardDrop: [phases.descending],
  start: [phases.pending, phases.gameOver],
  countdown: [phases.starting, phases.resuming],
  pause: [phases.descending, phases.locking, phases.clearing, phases.spawning],
  resume: [phases.paused],
  restore: [phases.resuming],
  hold: [phases.descending]
};
export const reducer = (state, action) =>
  validPhases[action.type]?.includes(state.phase)
    ? visitors[action.type](state, action)
    : state;

export const initialState = {
  playfield: emptyPlayField,
  queue: [],
  phase: phases.pending,
  tetromino: undefined,
  alive: false,
  interval: 1000,
  lines: 0,
  countdown: 0
};
