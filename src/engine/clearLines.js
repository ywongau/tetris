const emptyLines = (width, height) =>
  [...Array(height)].map(() => [...Array(width)].map(() => false));

export const clearLines = (playfield) => {
  const width = playfield[0].length;
  const clearedPlayfield = playfield.reduceRight(
    (acc, row) => (row.every((occupied) => occupied) ? acc : [row].concat(acc)),
    []
  );
  const rowsCleared = playfield.length - clearedPlayfield.length;
  return {
    playfield: emptyLines(width, rowsCleared).concat(clearedPlayfield),
    rowsCleared
  };
};
