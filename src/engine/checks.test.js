import { blockOut, lock } from './checks';

import { expect } from 'chai';

const _ = undefined;
const o = true;
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('checks', () => {
  it('is NOT blocked out if the tetromino does NOT overlap any blocks in the playfield', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, o, _],
      [_, _, _, o, _],
      [_, _, _, o, _]
    ];
    const tetromino = {
      left: 2,
      top: 0,
      shape: [
        [o, o],
        [o, o]
      ]
    };
    const result = blockOut(tetromino, playfield);
    expect(result).to.equal(false);
  });
  it('is blocked out if the tetromino overlaps any blocks in the playfield', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, o, _],
      [_, _, _, o, _],
      [_, _, _, o, _],
      [_, _, _, o, _]
    ];
    const tetromino = {
      left: 2,
      top: 0,
      shape: [
        [o, o],
        [o, o]
      ]
    };
    const result = blockOut(tetromino, playfield);
    expect(result).to.equal(true);
  });
});
