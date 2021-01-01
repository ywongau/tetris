/* eslint-disable react-hooks/rules-of-hooks */

import { directions } from '../../engine/actions';
import { initialState, phases, reducer } from './reducer';
import { useEffect, useReducer } from 'react';

const keyActionMappings = {
  ArrowLeft: { type: 'move', payload: directions.left },
  ArrowRight: { type: 'move', payload: directions.right },
  ArrowDown: { type: 'move', payload: directions.down },
  ArrowUp: { type: 'rotateRight' },
  ' ': { type: 'hardDrop' },
  Escape: { type: 'pause' },
  z: { type: 'rotateLeft' }
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
      if (keyActionMappings[e.key]) {
        dispatch(keyActionMappings[e.key]);
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
