import clear1Mp3 from './mp3/clear1.mp3';
import clear2Mp3 from './mp3/clear2.mp3';
import clear3Mp3 from './mp3/clear3.mp3';
import clear4Mp3 from './mp3/clear4.mp3';
import gameOverMp3 from './mp3/gameOver.mp3';
import hardDropMp3 from './mp3/hardDrop.mp3';
import lockedMp3 from './mp3/locked.mp3';
import spawnMp3 from './mp3/spawn.mp3';

export const Player = (AudioContext) => {
  const context = new AudioContext();
  const decode = (file) =>
    fetch(file)
      .then((data) => data.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer));

  const play = (file) => {
    const promiseOfAudio = decode(file);
    return () =>
      promiseOfAudio.then((audioBuffer) => {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start();
      });
  };

  return {
    clear1: play(clear1Mp3),
    clear2: play(clear2Mp3),
    clear3: play(clear3Mp3),
    clear4: play(clear4Mp3),
    locked: play(lockedMp3),
    spawn: play(spawnMp3),
    hardDrop: play(hardDropMp3),
    gameOver: play(gameOverMp3)
  };
};
