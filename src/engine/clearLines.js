const emptyLines = (width, height) =>
  [...Array(height)].map(() => [...Array(width)].map(() => undefined));

export const clearLines = (playfield) => {
  const width = playfield[0].length;
  const clearedPlayfield = playfield.reduceRight(
    (acc, row) => (row.every((occupied) => occupied) ? acc : [row].concat(acc)),
    []
  );
  const linesCleared = playfield.length - clearedPlayfield.length;
  return {
    playfield: emptyLines(width, linesCleared).concat(clearedPlayfield),
    linesCleared
  };
};
