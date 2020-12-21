const merge = (tetromino, playfield) =>
  playfield.map((row, y) =>
    row.map(
      (occupied, x) =>
        occupied ||
        tetromino.shape[y - tetromino.top]?.[x - tetromino.left]
    )
  );

export const lock = (tetromino, playfield) => {
  const height = playfield.length;
  const locked = tetromino.shape.some((row, y) =>
    row.some(
      (occupied, x) =>
        occupied &&
        (y + tetromino.top >= height - 1 ||
          playfield[y + tetromino.top + 1]?.[x + tetromino.left])
    )
  );
  return {
    playfield: locked ? merge(tetromino, playfield) : playfield,
    locked
  };
};
