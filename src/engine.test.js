import Engine from './engine';
import { expect } from 'chai';
const _ = false;
const o = true;
const width = 5;
const height = 5;
const engine = Engine(width, height);
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('engine', () => {
  it('must move down to doom each tick', () => {
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
    const result = engine.next({
      playfield,
      tetromino
    });
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ]);
    expect(result.tetromino.top).to.equal(1);
    expect(result.tetromino.left).to.equal(0);
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
      top: 2,
      shape: [
        [_, _, _, _],
        [_, o, o, _],
        [_, o, o, _],
        [_, _, _, _]
      ]
    };
    const result = engine.next({
      playfield,
      tetromino
    });
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, o, o, _],
      [_, _, o, o, _]
    ]);
    expect(result.tetromino).to.deep.equal(null);
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
      top: 1,
      shape: [
        [_, _, _, _],
        [_, o, o, _],
        [_, o, o, _],
        [_, _, _, _]
      ]
    };
    const result = engine.next({
      playfield,
      tetromino
    });
    expect(result.playfield).to.deep.equal([
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, o, o, _],
      [_, _, o, o, _],
      [_, _, _, o, _]
    ]);
    expect(result.tetromino).to.deep.equal(null);
  });
});
