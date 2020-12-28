import moveMp3 from './mp3/move.mp3';

const context = new AudioContext();
const moveAudio = fetch(moveMp3)
  .then((data) => data.arrayBuffer())
  .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
  .then((audioBuffer) => {
    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    return source;
  });

export const move = () => moveAudio.then((source) => source.start());
