import { expect } from 'chai';
import { lock } from './lock';

const _ = false;
const o = true;
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('lock', () => {
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
        [_, _, _, _],
        [_, o, o, _],
        [_, o, o, _],
        [_, _, _, _]
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
      left: 1,
      top: 3,
      shape: [
        [_, _, _, _],
        [_, o, o, _],
        [_, o, o, _],
        [_, _, _, _]
      ]
    };
    const result = lock(tetromino, playfield);
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, o, o, _],
      [_, _, o, o, _]
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
      left: 1,
      top: 2,
      shape: [
        [_, _, _, _],
        [_, o, o, _],
        [_, o, o, _],
        [_, _, _, _]
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
});
