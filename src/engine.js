const getBlock = (tetromino, playfieldX, playfieldY) =>
  tetromino.shape[playfieldY - tetromino.top + 1]?.[playfieldX - tetromino.left];

const merge = ( playfield, tetromino) =>
  playfield.map((row, y) =>
    row.map((hasABlock, x) => hasABlock || getBlock(tetromino, x, y) === true)
  );

const next = (width, height) => ({ playfield, tetromino }) => {
  const movedTetromino = { ...tetromino, top: tetromino.top + 1 };
  const landed = movedTetromino.shape.some((row, y) =>
    row.some((hasABlock) => hasABlock && y + movedTetromino.top >= height)
  );
  return landed
    ? { playfield: merge(playfield, movedTetromino), tetromino: null }
    : { playfield, tetromino: movedTetromino };
};

export default (width, height) => ({
  next: next(width, height)
});
