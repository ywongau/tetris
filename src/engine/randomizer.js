import { I, J, L, O, S, T, Z } from './tetrominos';

const shuffle = (xs) => {
  const result = xs.slice(0);
  let i = result.slice(0).length - 1;
  while (i >= 0) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = result[i];
    result[i] = result[randomIndex];
    result[randomIndex] = temp;
    i = i - 1;
  }
  return result;
};
const tetrominos = [I, O, T, S, Z, J, L];

export const randomizer = () => shuffle(tetrominos);
