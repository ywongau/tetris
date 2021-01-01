/* eslint-disable react-hooks/rules-of-hooks */

import { directions, hardDrop } from '../../engine/actions';
import { initialState, phases, reducer } from './reducer';
import { useEffect, useReducer } from 'react';

const keyMappings = {
  ArrowLeft: directions.left,
  ArrowRight: directions.right,
  ArrowDown: directions.down
};
export const UseGameReducer = (audio, randomizer) => () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const shouldTick =
    state.alive &&
    state.tetromino !== undefined &&
    state.phase !== phases.paused;
  useEffect(() => {
    const handle = shouldTick
      ? setInterval(() => dispatch({ type: 'tick' }), state.interval)
      : 0;
    return () => clearInterval(handle);
  }, [shouldTick, state.interval]);

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
        ),
      [phases.starting]: () => {
        if (state.countdown > 0) {
          setTimeout(
            () =>
              dispatch({
                type: 'countdown'
              }),
            1000
          );
        } else {
          dispatch({
            type: 'spawn',
            payload: randomizer()
          });
        }
      },
      [phases.resuming]: () => {
        if (state.countdown > 0) {
          setTimeout(
            () =>
              dispatch({
                type: 'countdown'
              }),
            1000
          );
        } else {
          dispatch({
            type: 'restore'
          });
        }
      }
    };
    phaseVisitors[state.phase]?.();
  }, [state.phase, state.queue.length, state.countdown]);
  useEffect(() => {
    const onKeydown = (e) => {
      if (keyMappings[e.key]) {
        dispatch({ type: 'move', payload: keyMappings[e.key] });
      }
      if (e.key === 'ArrowUp') {
        dispatch({ type: 'rotateRight' });
      }
      if (e.key === ' ') {
        dispatch({ type: 'hardDrop' });
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'pause' });
      }
      if (e.key === 'z') {
        dispatch({ type: 'rotateLeft' });
      }
    };
    if (state.alive) {
      document.body.addEventListener('keydown', onKeydown);
    }
    return () => document.body.removeEventListener('keydown', onKeydown);
  }, [state.alive]);

  const start = () => dispatch({ type: 'start', payload: randomizer() });
  const resume = () => dispatch({ type: 'resume' });
  return {
    state,
    start,
    resume
  };
};
