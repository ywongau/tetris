import { Audio } from '../../sfx/audio';
import GameFactory from './Game';
import { UseGameReducer } from './useGameReducer';
import { randomizer } from '../../engine/randomizer';

const audio = Audio(AudioContext);
const useGameReducer = UseGameReducer(audio, randomizer);
const Game = GameFactory(useGameReducer);
export default Game;
