import { directions, move, rotateLeft, rotateRight } from './actions';

import { expect } from 'chai';

const _ = false;
const o = true;
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('rotate left', () => {
  it('works', () => {
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
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal({
      left: 0,
      top: 0,
      shape: [
        [_, _, _, _],
        [_, _, _, _],
        [o, o, o, o],
        [_, _, _, _]
      ]
    });
  });
  it('does nothing if it collides with left wall', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: -1,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if it collides with right wall', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 2,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if it collides with floor', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 2,
      shape: [
        [_, _, _, _],
        [_, _, _, _],
        [o, o, o, o],
        [_, _, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if the result collides with existing blocks', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [o, _, _, _, _],
      [o, _, _, _, _],
      [o, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
});

describe('rotate right', () => {
  it('works', () => {
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
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal({
      left: 0,
      top: 0,
      shape: [
        [_, _, _, _],
        [o, o, o, o],
        [_, _, _, _],
        [_, _, _, _]
      ]
    });
  });
  it('does nothing if it collides with left wall', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: -1,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if it collides with right wall', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 2,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if it collides with floor', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 2,
      shape: [
        [_, _, _, _],
        [_, _, _, _],
        [o, o, o, o],
        [_, _, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
  it('does nothing if the result collides with existing blocks', () => {
    const playfield = [
      [_, _, _, _, _],
      [o, _, _, _, _],
      [o, _, _, _, _],
      [o, _, _, _, _],
      [o, _, _, _, _]
    ];
    const tetromino = {
      left: 0,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal(tetromino);
  });
});

describe('move', () => {
  it('moves left', () => {
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
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = move(tetromino, playfield, directions.left);
    expect(result).to.deep.equal({
      left: -1,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    });
  });
  it('moves right', () => {
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
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = move(tetromino, playfield, directions.right);
    expect(result).to.deep.equal({
      left: 1,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    });
  });
  it('moves down', () => {
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
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = move(tetromino, playfield, directions.down);
    expect(result).to.deep.equal({
      left: 0,
      top: 1,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    });
  });
  it('does nothing if there is no space available', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: -1,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = move(tetromino, playfield, directions.left);
    expect(result).to.deep.equal(tetromino);
  });
});
