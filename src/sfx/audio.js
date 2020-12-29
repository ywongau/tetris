import clear1Mp3 from './mp3/clear1.mp3';
import clear2Mp3 from './mp3/clear2.mp3';
import clear3Mp3 from './mp3/clear3.mp3';
import clear4Mp3 from './mp3/clear4.mp3';
import gameOverMp3 from './mp3/gameOver.mp3';
import lockedMp3 from './mp3/locked.mp3';
import spawnMp3 from './mp3/spawn.mp3';

export const Audio = (AudioContext) => {
  const context = new AudioContext();
  const decode = (file) =>
    fetch(file)
      .then((data) => data.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer));

  const play = (promiseOfAudio) => () =>
    promiseOfAudio.then((audioBuffer) => {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
    });

  const clear1Audio = decode(clear1Mp3);
  const clear2Audio = decode(clear2Mp3);
  const clear3Audio = decode(clear3Mp3);
  const clear4Audio = decode(clear4Mp3);
  const lockedAudio = decode(lockedMp3);
  const spawnAudio = decode(spawnMp3);
  const gameOverAudio = decode(gameOverMp3);

  return {
    clear1: play(clear1Audio),
    clear2: play(clear2Audio),
    clear3: play(clear3Audio),
    clear4: play(clear4Audio),
    locked: play(lockedAudio),
    spawn: play(spawnAudio),
    gameOver: play(gameOverAudio)
  };
};
