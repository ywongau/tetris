import GameFactory from './Game';
import { Player } from '../../sfx/player';
import { UseGameReducer } from './useGameReducer';
import { randomizer } from '../../engine/randomizer';

const audio = Player(AudioContext);
const useGameReducer = UseGameReducer(audio, randomizer);
const Game = GameFactory(useGameReducer);
export default Game;
