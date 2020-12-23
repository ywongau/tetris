import GameFactory from './Game';
import { useGameReducer } from './useGameReducer';

const Game = GameFactory(useGameReducer);
export default Game;
