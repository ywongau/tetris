import { blockedOut, landed } from './checks';
import { left, right } from '../constants/wallKickData';

import { directionOffset } from '../constants/directions';

const wallKick = (tetromino, playfield, wallKickData) => {
  const wallKicked = {
    ...tetromino,
    left: tetromino.left + wallKickData[0][0],
    top: tetromino.top + wallKickData[0][1]
  };
  return blockedOut(wallKicked, playfield)
    ? wallKickData.length === 1
      ? null
      : wallKick(tetromino, playfield, wallKickData.slice(1))
    : wallKicked;
};
const tryRotate = (tetromino, originalTetromino, playfield, wallKickData) =>
  wallKick(tetromino, playfield, wallKickData) ?? originalTetromino;

const tryMove = (updatedTetromino, originalTetromino, playfield) =>
  blockedOut(updatedTetromino, playfield)
    ? originalTetromino
    : updatedTetromino;

export const rotateLeft = (tetromino, playfield) =>
  tryRotate(
    {
      ...tetromino,
      rotationPhase: (tetromino.rotationPhase + 3) % 4,
      shape: tetromino.shape.map((row, y) =>
        row.map((_, x) => tetromino.shape[x][tetromino.shape.length - 1 - y])
      )
    },
    tetromino,
    playfield,
    left[tetromino.name][tetromino.rotationPhase]
  );
export const rotateRight = (tetromino, playfield) =>
  tryRotate(
    {
      ...tetromino,
      rotationPhase: (tetromino.rotationPhase + 1) % 4,
      shape: tetromino.shape.map((row, y) =>
        row.map((_, x) => tetromino.shape[tetromino.shape.length - 1 - x][y])
      )
    },
    tetromino,
    playfield,
    right[tetromino.name][tetromino.rotationPhase]
  );

export const move = (tetromino, playfield, direction) =>
  tryMove(
    {
      ...tetromino,
      left: tetromino.left + directionOffset[direction].left,
      top: tetromino.top + directionOffset[direction].top
    },
    tetromino,
    playfield
  );
const merge = (tetromino, playfield) =>
  playfield.map((row, y) =>
    row.map(
      (occupied, x) =>
        occupied || tetromino.shape[y - tetromino.top]?.[x - tetromino.left]
    )
  );

export const lock = (tetromino, playfield) => {
  const locked = landed(tetromino, playfield);
  return {
    playfield: locked ? merge(tetromino, playfield) : playfield,
    locked
  };
};

export const hardDrop = (tetromino, playfield, top = tetromino.top) => {
  const result = { ...tetromino, top };
  return landed(result, playfield)
    ? result
    : hardDrop(tetromino, playfield, top + 1);
};
