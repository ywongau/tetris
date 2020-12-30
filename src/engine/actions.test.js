import {
  directions,
  hardDrop,
  lock,
  move,
  rotateLeft,
  rotateRight
} from './actions';

import { expect } from 'chai';

const _ = undefined;
const o = 'I';
// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('rotate left', () => {
  it('works for a 4x4 tetromino', () => {
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
  it('works for a 3x3 tetromino', () => {
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
        [_, o, _],
        [o, o, o],
        [_, _, _]
      ]
    };
    const result = rotateLeft(tetromino, playfield);
    expect(result).to.deep.equal({
      left: 0,
      top: 0,
      shape: [
        [_, o, _],
        [o, o, _],
        [_, o, _]
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
  it('works for a 3x3 tetromino', () => {
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
        [_, o, _],
        [o, o, o],
        [_, _, _]
      ]
    };
    const result = rotateRight(tetromino, playfield);
    expect(result).to.deep.equal({
      left: 0,
      top: 0,
      shape: [
        [_, o, _],
        [_, o, o],
        [_, o, _]
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
  it('does nothing if there is no space available on the left', () => {
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
  it('does nothing if there is no space available on the left', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _]
    ];
    const tetromino = {
      left: 3,
      top: 0,
      shape: [
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _],
        [_, o, _, _]
      ]
    };
    const result = move(tetromino, playfield, directions.right);
    expect(result).to.deep.equal(tetromino);
  });
});
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
});
describe('ghost piece', () => {
  it('works', () => {
    const playfield = [
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
      [_, _, _, _, _],
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
    const result = hardDrop(tetromino, playfield);
    expect(result).to.deep.equal({
      left: 2,
      top: 2,
      shape: [
        [o, o],
        [o, o]
      ]
    });
  });
});
