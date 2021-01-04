//https://tetris.fandom.com/wiki/SRS
const _ = undefined;
const o = 'O';
export const O = {
  top: 0,
  left: 4,
  name: o,
  rotationPhase: 0,
  shape: [
    [o, o],
    [o, o]
  ]
};
const i = 'I';
export const I = {
  top: 0,
  left: 3,
  name: i,
  rotationPhase: 0,
  shape: [
    [_, _, _, _],
    [i, i, i, i],
    [_, _, _, _],
    [_, _, _, _]
  ]
};
const s = 'S';
export const S = {
  top: 0,
  left: 3,
  name: s,
  rotationPhase: 0,
  shape: [
    [_, s, s],
    [s, s, _],
    [_, _, _]
  ]
};
const z = 'Z';
export const Z = {
  top: 0,
  left: 3,
  name: z,
  rotationPhase: 0,
  shape: [
    [z, z, _],
    [_, z, z],
    [_, _, _]
  ]
};
const t = 'T';
export const T = {
  top: 0,
  left: 3,
  name: t,
  rotationPhase: 0,
  shape: [
    [_, t, _],
    [t, t, t],
    [_, _, _]
  ]
};

const j = 'J';
export const J = {
  top: 0,
  left: 3,
  name: j,
  rotationPhase: 0,
  shape: [
    [j, _, _],
    [j, j, j],
    [_, _, _]
  ]
};

const l = 'L';
export const L = {
  top: 0,
  left: 3,
  name: l,
  rotationPhase: 0,
  shape: [
    [_, _, l],
    [l, l, l],
    [_, _, _]
  ]
};

export const lookup = {
  O, L, J, Z, I, T, S
};
