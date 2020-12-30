import { landed } from './checks';
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

export const directions = {
  left: 37,
  right: 39,
  down: 40
};

const directionOffset = {
  [directions.left]: {
    left: -1,
    top: 0
  },
  [directions.right]: {
    left: 1,
    top: 0
  },
  [directions.down]: {
    left: 0,
    top: 1
  }
};

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

export const ghostPiece = (tetromino, playfield, top = tetromino.top) => {
  const result = { ...tetromino, top };
  return landed(result, playfield)
    ? result
    : ghostPiece(tetromino, playfield, top + 1);
};
