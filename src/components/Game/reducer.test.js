import { I, J, L, O, S, T, Z } from '../../engine/tetrominoes';
import { directions, rotateLeft, rotateRight } from '../../engine/actions';
import { phases, reducer } from './reducer';

import { expect } from 'chai';
import { lock } from '../../engine/checks';

const initialState = {
  playfield: [...Array(20)].map(() => [...Array(10)].map(() => undefined)),
  queue: [I, J, L, O, S, T, Z],
  phase: phases.descending,
  tetromino: I,
  alive: true,
  interval: 1000,
  lines: 0
};
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('reducer', () => {
  it('moves left', () => {
    const result = reducer(initialState, {
      type: 'move',
      payload: directions.left
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...I, left: I.left - 1 }
    });
  });
  it('moves right', () => {
    const result = reducer(initialState, {
      type: 'move',
      payload: directions.right
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...I, left: I.left + 1 }
    });
  });
  it('moves right', () => {
    const result = reducer(initialState, {
      type: 'move',
      payload: directions.right
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...I, left: I.left + 1 }
    });
  });
  it('ticks', () => {
    const result = reducer(initialState, {
      type: 'tick'
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...I, top: I.top + 1 }
    });
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
      { ...initialState, tetromino: { ...O, top: 17 } },
      { type: 'tick' }
    );
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...O, top: 18 },
      phase: phases.locking
    });
  });
  it('moves down', () => {
    const result = reducer(initialState, {
      type: 'move',
      payload: directions.down
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...I, top: I.top + 1 }
    });
  });
  it('sets phase to locking when a tetromino is landed', () => {
    const result = reducer(
      { ...initialState, tetromino: { ...O, top: 17 } },
      { type: 'move', payload: directions.down }
    );
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...O, top: 18 },
      phase: phases.locking
    });
  });
  it('locks a landed tetromino if phase is locking', () => {
    const tetromino = { ...O, top: 18 };
    const result = reducer(
      { ...initialState, tetromino, phase: phases.locking },
      { type: 'move', payload: directions.down }
    );
    expect(result).to.deep.equal({
      ...initialState,
      playfield: lock(tetromino, initialState.playfield).playfield,
      phase: phases.clearing,
      tetromino: undefined
    });
  });
  it('still allows move when locking', () => {
    const tetromino = { ...O, top: 18 };
    const result = reducer(
      { ...initialState, tetromino, phase: phases.locking },
      { type: 'move', payload: directions.right }
    );
    expect(result).to.deep.equal({
      ...initialState,
      phase: phases.locking,
      tetromino: { ...tetromino, left: tetromino.left + 1 }
    });
  });
  it('does not set locking to true before a tetromino is landed', () => {
    const result = reducer(
      { ...initialState, tetromino: { ...O, top: 16 } },
      { type: 'move', payload: directions.down }
    );
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: { ...O, top: 17 },
      phase: phases.descending
    });
  });
  it('locks the tetromino, sets phase to clearing', () => {
    const tetromino = { ...O, top: 18 };
    const result = reducer(
      { ...initialState, tetromino, phase: phases.locking },
      { type: 'lock' }
    );
    expect(result).to.deep.equal({
      ...initialState,
      playfield: lock(tetromino, initialState.playfield).playfield,
      tetromino: undefined,
      phase: phases.clearing
    });
  });
  it('does not lock the tetromino if it has not landed', () => {
    const tetromino = { ...O, top: 17 };
    const result = reducer(
      { ...initialState, tetromino, phase: phases.locking },
      { type: 'lock' }
    );
    expect(result).to.deep.equal({
      ...initialState,
      tetromino
    });
  });
  it('clears lines and set phase to spawning', () => {
    const playfield = [...Array(20)].map((_, y) =>
      [...Array(10)].map(() => (y === 19 ? 'I' : undefined))
    );
    const result = reducer(
      {
        ...initialState,
        tetromino: undefined,
        playfield,
        phase: phases.clearing
      },
      { type: 'clear' }
    );
    expect(result).to.deep.equal({
      ...initialState,
      playfield: initialState.playfield,
      phase: phases.spawning,
      tetromino: undefined,
      lines: 1
    });
  });
  it('rotates right', () => {
    const result = reducer(initialState, {
      type: 'rotateRight'
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: rotateRight(I, initialState.playfield)
    });
  });
  it('rotates left', () => {
    const result = reducer(initialState, {
      type: 'rotateLeft'
    });
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: rotateLeft(I, initialState.playfield)
    });
  });
  it('spawns a tetrimino from the queue', () => {
    const result = reducer(
      { ...initialState, tetromino: undefined, phase: phases.spawning },
      {
        type: 'spawn'
      }
    );
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: I,
      queue: initialState.queue.slice(1),
      phase: phases.descending
    });
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
    expect(result).to.deep.equal({
      ...initialState,
      tetromino: I,
      queue: [O, S, I, O, T, S, Z, J, L]
    });
  });
  it('dies when there is no space to spawn', () => {
    const state = {
      ...initialState,
      tetromino: undefined,
      phase: phases.spawning,
      playfield: [...Array(20)].map(() => [...Array(10)].map(() => 'I'))
    };
    const result = reducer(state, {
      type: 'spawn'
    });
    expect(result).to.deep.equal({
      ...state,
      tetromino: I,
      queue: initialState.queue.slice(1),
      alive: false,
      phase: phases.gameOver
    });
  });
});
