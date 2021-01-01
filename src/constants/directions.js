export const directions = {
  left: 37,
  right: 39,
  down: 40
};
export const directionOffset = {
  [directions.left]: {
    left: -1,
    top: 0
  },
  [directions.right]: {
    left: 1,
    top: 0
  },
  [directions.down]: {
    left: 0,
    top: 1
  }
};
