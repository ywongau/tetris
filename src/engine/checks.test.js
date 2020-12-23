import { alive, lock } from './checks';

import { expect } from 'chai';

const _ = undefined;
const o = true;
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('checks', () => {
  it(`does not lock if the tetromino didn't land on anything`, () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 0,
      shape: [
        [o, o],
        [o, o]
      ]
    };
    const result = lock(tetromino, playfield);
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ]);
    expect(result.locked).to.equal(false);
  });

  it('locks the Tetromino after it landed', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 3,
      shape: [
        [o, o],
        [o, o]
      ]
    };
    const result = lock(tetromino, playfield);
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [o, o, _, _, _],
      [o, o, _, _, _]
    ]);
    expect(result.locked).to.deep.equal(true);
  });

  it('locks the Tetromino after it landed on locked blocks', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, o, _]
    ];
    const tetromino = {
      left: 2,
      top: 2,
      shape: [
        [o, o],
        [o, o]
      ]
    };
    const result = lock(tetromino, playfield);
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, o, o, _],
      [_, _, o, o, _],
      [_, _, _, o, _]
    ]);
    expect(result.locked).to.deep.equal(true);
  });
  it('is alive if the tetromino does not overlap any blocks in the playfield', () => {
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
    const result = alive(tetromino, playfield);
    expect(result).to.equal(true);
  });
  it('is dead if the tetromino overlaps any blocks in the playfield', () => {
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
    const result = alive(tetromino, playfield);
    expect(result).to.equal(false);
  });
});
