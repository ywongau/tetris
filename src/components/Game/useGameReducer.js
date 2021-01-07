/* eslint-disable react-hooks/rules-of-hooks */

import { initialState, reducer } from './reducer';
import { useEffect, useReducer } from 'react';

import { directions } from '../../constants/directions';
import { phases } from '../../constants/phases';

const dispatchWith = (action) => (dispatch) => dispatch(action);
const autoRepeat = (action, repeatInterval, cancelKey) => (dispatch, e) => {
  if (e.repeat) {
    return;
  }
  dispatch(action);
  const delay = 100 - repeatInterval;
  const timeout = setTimeout(() => {
    const interval = setInterval(() => {
      dispatch(action);
    }, repeatInterval);
    const cancelInterval = (e) => {
      if (e.key === cancelKey) {
        clearInterval(interval);
        document.body.removeEventListener('keyup', cancelInterval);
      }
    };
    document.body.addEventListener('keyup', cancelInterval);
  }, delay);
  const cancelTimeout = (e) => {
    if (e.key === cancelKey) {
      clearTimeout(timeout);
      document.body.removeEventListener('keyup', cancelTimeout);
    }
  };
  document.body.addEventListener('keyup', cancelTimeout);
};
const keyActionMappings = {
  ArrowLeft: autoRepeat(
    { type: 'move', payload: directions.left },
    50,
    'ArrowLeft'
  ),
  ArrowRight: autoRepeat(
    { type: 'move', payload: directions.right },
    50,
    'ArrowRight'
  ),
  ArrowDown: autoRepeat(
    { type: 'move', payload: directions.down },
    33,
    'ArrowDown'
  ),
  ArrowUp: dispatchWith({ type: 'rotateRight' }),
  x: dispatchWith({ type: 'rotateRight' }),
  ' ': dispatchWith({ type: 'hardDrop' }),
  Escape: dispatchWith({ type: 'pause' }),
  F1: dispatchWith({ type: 'pause' }),
  z: dispatchWith({ type: 'rotateLeft' }),
  Control: dispatchWith({ type: 'rotateLeft' }),
  c: dispatchWith({ type: 'hold' })
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
        dispatch({
          type: 'spawn',
          payload: state.queue.length <= 3 ? randomizer() : []
        }),
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
        keyActionMappings[e.key](dispatch, e);
        e.preventDefault();
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
