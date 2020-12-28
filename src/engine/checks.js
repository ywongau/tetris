const merge = (tetromino, playfield) =>
  playfield.map((row, y) =>
    row.map(
      (occupied, x) =>
        occupied || tetromino.shape[y - tetromino.top]?.[x - tetromino.left]
    )
  );

export const landed = (tetromino, playfield) => {
  const height = playfield.length;
  return tetromino.shape.some((row, y) =>
    row.some(
      (occupied, x) =>
        occupied &&
        (y + tetromino.top >= height - 1 ||
          playfield[y + tetromino.top + 1][x + tetromino.left])
    )
  );
};

export const lock = (tetromino, playfield) => {
  const locked = landed(tetromino, playfield);
  return {
    playfield: locked ? merge(tetromino, playfield) : playfield,
    locked
  };
};

export const alive = (tetromino, playfield) =>
  !tetromino.shape.some((row, y) =>
    row.some(
      (occupied, x) =>
        occupied && playfield[y + tetromino.top][x + tetromino.left]
    )
  );
