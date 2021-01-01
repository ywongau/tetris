import { landed } from './checks';
import { directionOffset } from '../constants/directions';
const isPositionValid = (tetromino, playfield) => {
  const width = playfield[0].length;
  const height = playfield.length;
  return !tetromino.shape.some((row, y) =>
    row.some(
      (occupied, x) =>
        occupied &&
        (x + tetromino.left < 0 ||
          x + tetromino.left >= width ||
          y + tetromino.top >= height ||
          playfield[y + tetromino.top][x + tetromino.left])
    )
  );
};

const returnOriginalIfInvalid = (
  updatedTetromino,
  originalTetromino,
  playfield
) =>
  isPositionValid(updatedTetromino, playfield)
    ? updatedTetromino
    : originalTetromino;

export const rotateLeft = (tetromino, playfield) =>
  returnOriginalIfInvalid(
    {
      ...tetromino,
      shape: tetromino.shape.map((row, y) =>
        row.map((_, x) => tetromino.shape[x][tetromino.shape.length - 1 - y])
      )
    },
    tetromino,
    playfield
  );
export const rotateRight = (tetromino, playfield) =>
  returnOriginalIfInvalid(
    {
      ...tetromino,
      shape: tetromino.shape.map((row, y) =>
        row.map((_, x) => tetromino.shape[tetromino.shape.length - 1 - x][y])
      )
    },
    tetromino,
    playfield
  );

export const move = (tetromino, playfield, direction) =>
  returnOriginalIfInvalid(
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
