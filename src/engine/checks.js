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

export const blockedOut = (tetromino, playfield) =>
  tetromino.shape.some((row, y) =>
    row.some(
      (occupied, x) =>
        occupied && playfield[y + tetromino.top][x + tetromino.left]
    )
  );
