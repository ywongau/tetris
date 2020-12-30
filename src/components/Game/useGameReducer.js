/* eslint-disable react-hooks/rules-of-hooks */

import { directions, ghostPiece } from '../../engine/actions';
import { phases, reducer } from './reducer';
import { useEffect, useReducer } from 'react';

const keyMappings = {
  ArrowLeft: directions.left,
  ArrowRight: directions.right,
  ArrowDown: directions.down
};
export const UseGameReducer = (audio, randomizer) => () => {
  const queue = randomizer();
  const tetromino = queue[0];
  const playfield = [...Array(20)].map(() =>
    [...Array(10)].map(() => undefined)
  );
  const [state, dispatch] = useReducer(reducer, {
    playfield,
    queue: queue.slice(1),
    phase: phases.descending,
    tetromino,
    alive: true,
    score: 0,
    lines: 0,
    interval: 1000,
    ghostPiece: ghostPiece(tetromino, playfield)
  });
  useEffect(() => {
    const handle = state.alive
      ? setInterval(() => dispatch({ type: 'tick' }), state.interval)
      : 0;
    return () => clearInterval(handle);
  }, [state.alive, state.interval]);
  useEffect(() => {
    if (state.sfx) {
      audio[state.sfx]();
    }
  }, [state.sfx]);
  useEffect(() => {
    const phaseVisitors = {
      [phases.spawning]: () =>
        setTimeout(
          () =>
            dispatch({
              type: 'spawn',
              payload: state.queue.length <= 3 ? randomizer() : []
            }),
          500
        ),
      [phases.locking]: () =>
        setTimeout(
          () =>
            dispatch({
              type: 'lock'
            }),
          500
        ),
      [phases.clearing]: () =>
        setTimeout(
          () =>
            dispatch({
              type: 'clear'
            }),
          500
        )
    };
    phaseVisitors[state.phase]?.();
  }, [state.phase, state.queue.length]);
  useEffect(() => {
    const onKeydown = (e) => {
      if (keyMappings[e.key]) {
        dispatch({ type: 'move', payload: keyMappings[e.key] });
      }
      if (e.key === 'ArrowUp') {
        dispatch({ type: 'rotateRight' });
      }
    };
    if (state.alive) {
      document.body.addEventListener('keydown', onKeydown);
    }
    return () => document.body.removeEventListener('keydown', onKeydown);
  }, [state.alive]);
  return {
    state
  };
};
