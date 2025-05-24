import { I, J, L, O, S, T, Z } from '../../constants/tetrominos';
import { hardDrop, lock, rotateLeft, rotateRight } from '../../engine/actions';

import { directions } from '../../constants/directions';
import { expect } from 'chai';
import { phases } from '../../constants/phases';
import { reducer } from './reducer';
import sinon from 'sinon';

const _ = undefined;
const o = 'O';
const emptyPlayField = [...Array(22)].map(() =>
  [...Array(10)].map(() => undefined)
);
const initialState = {
  playfield: emptyPlayField,
  queue: [J, L, O, S, T, Z],
  phase: phases.descending,
  tetromino: I,
  alive: true,
  interval: 1000,
  lines: 0,
  originalPhase: undefined,
  hold: undefined
};
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('reducer', () => {
  beforeEach(() => {
    sinon.stub(Math, 'random').returns(0.9);
  });
  afterEach(() => {
    Math.random.restore();
  });
  describe('move', () => {
    it('moves left', () => {
      const result = reducer(initialState, {
        type: 'move',
        payload: directions.left
      });
      expect(result.tetromino).to.deep.equal({ ...I, left: I.left - 1 });
      expect(result.ghostPiece).to.deep.equal(
        hardDrop(result.tetromino, result.playfield)
      );
    });
    it('moves right', () => {
      const result = reducer(initialState, {
        type: 'move',
        payload: directions.right
      });
      expect(result.tetromino).to.deep.equal({ ...I, left: I.left + 1 });
      expect(result.ghostPiece).to.deep.equal(
        hardDrop(result.tetromino, result.playfield)
      );
    });
    it('moves down', () => {
      const result = reducer(initialState, {
        type: 'move',
        payload: directions.down
      });
      expect(result.tetromino).to.deep.equal({ ...I, top: I.top + 1 });
    });
    it('sets phase to locking when a tetromino is landed', () => {
      const result = reducer(
        { ...initialState, tetromino: { ...O, top: 19 } },
        { type: 'move', payload: directions.down }
      );
      expect(result.tetromino).to.deep.equal({ ...O, top: 20 });
      expect(result.phase).to.equal(phases.locking);
    });
    it('locks a landed tetromino if phase is locking', () => {
      const tetromino = { ...O, top: 20 };
      const result = reducer(
        { ...initialState, tetromino, phase: phases.locking },
        { type: 'move', payload: directions.down }
      );
      expect(result.playfield).to.deep.equal(
        lock(tetromino, initialState.playfield).playfield
      );
      expect(result.phase).to.equal(phases.clearing);
      expect(result.sfx).to.equal('locked');
      expect(result.tetromino).to.equal(undefined);
    });
    it('still allows move when locking', () => {
      const tetromino = { ...O, top: 20 };
      const result = reducer(
        { ...initialState, tetromino, phase: phases.locking },
        { type: 'move', payload: directions.right }
      );
      expect(result.phase).to.equal(phases.locking);
      expect(result.tetromino).to.deep.equal({
        ...tetromino,
        left: tetromino.left + 1
      });
    });
    it('does not set locking to true before a tetromino is landed', () => {
      const result = reducer(
        { ...initialState, tetromino: { ...O, top: 18 } },
        { type: 'move', payload: directions.down }
      );
      expect(result.phase).to.equal(phases.descending);
      expect(result.tetromino).to.deep.equal({ ...O, top: 19 });
    });
  });
  describe('tick', () => {
    it('ticks', () => {
      const result = reducer(initialState, {
        type: 'tick'
      });
      expect(result.tetromino).to.deep.equal({ ...I, top: I.top + 1 });
    });
    it('does nothing if phase is not descending', () => {
      const state = {
        ...initialState,
        phase: phases.spawning,
        tetromino: undefined
      };
      const result = reducer(state, {
        type: 'tick'
      });
      expect(result).to.deep.equal(state);
    });
    it('sets phase to locking when a tetromino is landed', () => {
      const result = reducer(
        { ...initialState, tetromino: { ...O, top: 19 } },
        { type: 'tick' }
      );
      expect(result.tetromino).to.deep.equal({ ...O, top: 20 });
      expect(result.phase).to.equal(phases.locking);
    });
  });
  describe('lock', () => {
    it('locks the tetromino, sets phase to clearing', () => {
      const tetromino = { ...O, top: 20 };
      const result = reducer(
        { ...initialState, tetromino, phase: phases.locking },
        { type: 'lock' }
      );

      expect(result.playfield).to.deep.equal(
        lock(tetromino, initialState.playfield).playfield
      );
      expect(result.phase).to.equal(phases.clearing);
      expect(result.sfx).to.equal('locked');
      expect(result.tetromino).to.equal(undefined);
    });
    it('does not lock the tetromino if it has not landed', () => {
      const tetromino = { ...O, top: 19 };
      const result = reducer(
        { ...initialState, tetromino, phase: phases.locking },
        { type: 'lock' }
      );
      expect(result.tetromino).to.deep.equal(tetromino);
    });
  });
  describe('clear', () => {
    const playfield = [
      ...[...Array(21)].map(() => [_, _, _, _, _, _, _, _, _, _]),
      [o, o, o, o, o, o, o, o, o, o]
    ];
    it('clears lines and set phase to spawning', () => {
      const result = reducer(
        {
          ...initialState,
          tetromino: undefined,
          playfield,
          phase: phases.clearing
        },
        { type: 'clear' }
      );
      expect(result.playfield).to.deep.equal(initialState.playfield);
      expect(result.phase).to.equal(phases.spawning);
      expect(result.sfx).to.equal('clear1');
      expect(result.tetromino).to.equal(undefined);
      expect(result.lines).to.equal(1);
    });
    it('decreases interval after every 10 lines', () => {
      const result = reducer(
        {
          ...initialState,
          tetromino: undefined,
          playfield,
          phase: phases.clearing,
          lines: 9
        },
        { type: 'clear' }
      );
      expect(result.interval).to.equal(900);
    });
    it('limites minimum interval to 50', () => {
      const result = reducer(
        {
          ...initialState,
          tetromino: undefined,
          playfield,
          phase: phases.clearing,
          lines: 99
        },
        { type: 'clear' }
      );
      expect(result.interval).to.equal(50);
    });
  });
  describe('rotation', () => {
    it('rotates right', () => {
      const result = reducer(initialState, {
        type: 'rotateRight'
      });
      expect(result.tetromino).to.deep.equal(
        rotateRight(I, initialState.playfield)
      );
      expect(result.ghostPiece).to.deep.equal(
        hardDrop(result.tetromino, result.playfield)
      );
    });
    it('rotates left', () => {
      const result = reducer(initialState, {
        type: 'rotateLeft'
      });
      expect(result.tetromino).to.deep.equal(
        rotateLeft(I, initialState.playfield)
      );
      expect(result.ghostPiece).to.deep.equal(
        hardDrop(result.tetromino, result.playfield)
      );
    });
  });
  describe('spawn', () => {
    it('spawns a tetrimino from the queue', () => {
      const result = reducer(
        { ...initialState, tetromino: undefined, phase: phases.spawning },
        {
          type: 'spawn'
        }
      );
      expect(result.phase).to.equal(phases.descending);
      expect(result.sfx).to.equal('spawn');
      expect(result.tetromino).to.deep.equal(J);
      expect(result.queue).to.deep.equal(initialState.queue.slice(1));
    });
    it('appends provided tetriminos into the queue', () => {
      const result = reducer(
        {
          ...initialState,
          tetromino: undefined,
          queue: [I, O, S],
          phase: phases.spawning
        },
        {
          type: 'spawn',
          payload: [I, O, T, S, Z, J, L]
        }
      );
      expect(result.queue).to.deep.equal([O, S, I, O, T, S, Z, J, L]);
    });
  });
  it('dies when the tetromino is landed when spawned', () => {
    const state = {
      ...initialState,
      tetromino: undefined,
      phase: phases.spawning,
      playfield: [
        [_, _, _, _, _, _, _, _, _, _],
        [_, _, _, _, _, _, _, _, _, _],
        [_, o, o, o, o, o, o, o, o, o],
        ...[...Array(17)].map(() => [_, o, o, o, o, o, o, o, o, o])
      ]
    };
    const result = reducer(state, {
      type: 'spawn'
    });
    expect(result.phase).to.equal(phases.gameOver);
    expect(result.sfx).to.equal('gameOver');
    expect(result.alive).to.equal(false);
  });
  it('dies when there is blocked out', () => {
    const state = {
      ...initialState,
      tetromino: undefined,
      phase: phases.spawning,
      playfield: [
        [_, o, o, o, o, o, o, o, o, o],
        [_, o, o, o, o, o, o, o, o, o],
        [_, _, _, _, _, _, _, _, _, o],
        ...[...Array(17)].map(() => [_, o, o, o, o, o, o, o, o, o])
      ]
    };
    const result = reducer(state, {
      type: 'spawn'
    });
    expect(result.phase).to.equal(phases.gameOver);
    expect(result.sfx).to.equal('gameOver');
    expect(result.alive).to.equal(false);
  });
  it('hard drops', () => {
    const result = reducer(initialState, {
      type: 'hardDrop'
    });
    expect(result.phase).to.equal(phases.clearing);
    expect(result.tetromino).to.deep.equal(undefined);
    expect(result.playfield).to.deep.equal(
      lock(
        hardDrop(initialState.tetromino, initialState.playfield),
        initialState.playfield
      ).playfield
    );
  });
  describe('start', () => {
    it('initialises state', () => {
      const result = reducer(
        { phase: phases.pending },
        {
          type: 'start',
          payload: [I, J, L, O, S, T, Z]
        }
      );
      expect(result).to.deep.equal({
        playfield: emptyPlayField,
        queue: [I, J, L, O, S, T, Z],
        phase: phases.starting,
        tetromino: undefined,
        alive: true,
        interval: 1000,
        lines: 0,
        countdown: 3,
        originalPhase: undefined
      });
    });
  });
  describe('countdown', () => {
    it('counts down', () => {
      const state = {
        ...initialState,
        phase: phases.starting,
        countdown: 3
      };
      const result = reducer(state, {
        type: 'countdown'
      });
      expect(result).to.deep.equal({
        ...state,
        countdown: 2
      });
    });
    it('does not count below 0', () => {
      const state = {
        ...initialState,
        phase: phases.starting,
        countdown: 0
      };
      const result = reducer(state, {
        type: 'countdown'
      });
      expect(result).to.deep.equal({
        ...state,
        countdown: 0
      });
    });
  });
  describe('pause', () => {
    it('stores current phase', () => {
      const result = reducer(initialState, {
        type: 'pause'
      });
      expect(result).to.deep.equal({
        ...initialState,
        phase: phases.paused,
        originalPhase: initialState.phase
      });
    });
  });
  describe('restore', () => {
    it('restores phase', () => {
      const result = reducer(
        {
          ...initialState,
          phase: phases.resuming,
          originalPhase: initialState.phase
        },
        {
          type: 'restore'
        }
      );
      expect(result.originalPhase).to.equal(undefined);
      expect(result.phase).to.equal(initialState.phase);
    });
  });
  describe('hold', () => {
    it('moves current tetromino to hold and spawn a new one', () => {
      const result = reducer(initialState, {
        type: 'hold'
      });
      expect(result.hold).to.deep.equal(initialState.tetromino);
      expect(result.tetromino).to.deep.equal(initialState.queue[0]);
      expect(result.queue).to.deep.equal(initialState.queue.slice(1));
      expect(result.holdLock).to.equal(true);
      expect(result.ghostPiece).to.deep.equal(
        hardDrop(result.tetromino, result.playfield)
      );
    });
    it('spawns a held tetromino', () => {
      const result = reducer(
        { ...initialState, hold: T },
        {
          type: 'hold'
        }
      );
      expect(result.tetromino).to.deep.equal(T);
      expect(result.queue).to.deep.equal(initialState.queue);
    });
    it('it does nothing if holdLock is true', () => {
      const result = reducer(
        { ...initialState, holdLock: true },
        {
          type: 'hold'
        }
      );
      expect(result.tetromino).to.deep.equal(initialState.tetromino);
    });
    it('should reset the position of the held tetromino', () => {
      const result = reducer(
        { ...initialState, tetromino: { ...I, left: 2, top: 2 } },
        {
          type: 'hold'
        }
      );
      expect(result.hold).to.deep.equal(I);
    });
    it('should reset holdLock on spawn', () => {
      const result = reducer(
        {
          ...initialState,
          tetromino: undefined,
          phase: phases.spawning,
          holdLock: true
        },
        {
          type: 'spawn'
        }
      );
      expect(result.holdLock).to.equal(false);
    });
  });
});
