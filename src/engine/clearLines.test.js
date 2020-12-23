import { clearLines } from './clearLines';
import { expect } from 'chai';

const _ = undefined;
const o = 'O';
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('clear lines', () => {
  it('returns original playfield if no lines are cleared', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [o, o, o, o, _],
      [o, o, _, o, _],
      [o, o, o, _, o]
    ];
    const result = clearLines(playfield);
    expect(result.linesCleared).to.equal(0);
    expect(result.playfield).to.deep.equal(playfield);
  });
  it('returns number of lines cleared and updated playfield', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [o, o, o, o, o],
      [o, o, _, o, o],
      [o, o, o, o, o]
    ];
    const result = clearLines(playfield);
    expect(result.linesCleared).to.deep.equal(2);
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [o, o, _, o, o]
    ]);
  });
});
