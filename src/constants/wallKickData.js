// https://tetris.fandom.com/wiki/SRS
const othersRight = [
  [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2]
  ],
  [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2]
  ],
  [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2]
  ],
  [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2]
  ]
];
const othersLeft = [
  othersRight[2],
  othersRight[1],
  othersRight[0],
  othersRight[3]
];

const iRight = [
  [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2]
  ],
  [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1]
  ],
  [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2]
  ],
  [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1]
  ]
];

const iLeft = [iRight[1], iRight[2], iRight[3], iRight[0]];

const o = [[[0, 0]], [[0, 0]], [[0, 0]], [[0, 0]]];

export const left = {
  I: iLeft,
  O: o,
  L: othersLeft,
  J: othersLeft,
  Z: othersLeft,
  S: othersLeft,
  T: othersLeft
};

export const right = {
  I: iRight,
  O: o,
  L: othersRight,
  J: othersRight,
  Z: othersRight,
  S: othersRight,
  T: othersRight
};
