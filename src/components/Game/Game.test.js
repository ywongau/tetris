import { I, J, L, O, S, T, Z } from '../../constants/tetrominos';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import GameFactory from './Game';
import { Player } from '../../sfx/player';
import React from 'react';
import { expect } from 'chai';
import { phases } from '../../constants/phases';
import sinon from 'sinon';

const { UseGameReducer } = require('./useGameReducer');
describe('Game', () => {
  beforeEach(() => {});
  afterEach(cleanup);
  const readCells = (container) =>
    [...container.querySelectorAll('.row')].map((row) =>
      [...row.querySelectorAll('div')].map((cell) => cell.className)
    );

  describe('Game with fake hooks', () => {
    const _ = undefined;
    const o = 'O';
    const fakeState = {
      playfield: [
        ...[...Array(21)].map(() => [_, _, _, _, _, _, _, _, _, _]),
        [o, o, o, o, o, o, o, o, o, o]
      ],
      tetromino: I,
      phase: phases.descending,
      queue: [J, L, O, S, T, Z],
      lines: 3
    };
    it('shows animation when clearedPlayfield lines', async () => {
      const fakeHook = () => ({
        state: {
          ...fakeState,
          tetromino: undefined,
          phase: phases.clearing
        }
      });
      const Game = GameFactory(fakeHook);
      render(<Game />);
      const playfield = screen.getByTestId('playfield');
      const lastRow = playfield.childNodes[21];
      expect(lastRow.classList.contains('clearing')).to.equal(true);
    });
    it('shows next', async () => {
      const fakeHook = () => ({
        state: fakeState
      });
      const Game = GameFactory(fakeHook);
      render(<Game />);
      const nextTetrominos = screen
        .getByText('NEXT')
        .parentElement.querySelectorAll('.small-tetromino');
      const getNextTetromino = (n) => readCells(nextTetrominos[n]);

      expect(getNextTetromino(0)).to.deep.equal([
        ['J', '', ''],
        ['J', 'J', 'J'],
        ['', '', '']
      ]);
      expect(getNextTetromino(1)).to.deep.equal([
        ['', '', 'L'],
        ['L', 'L', 'L'],
        ['', '', '']
      ]);
      expect(getNextTetromino(2)).to.deep.equal([
        ['O', 'O'],
        ['O', 'O']
      ]);
    });
    it('shows lines', () => {
      const fakeHook = () => ({
        state: fakeState
      });
      const Game = GameFactory(fakeHook);
      render(<Game />);
      screen.getByText('LINES');
      screen.getByText('3');
    });
  });

  describe('Game integration tests', () => {
    let _timers;
    let _fakeBufferSource;
    let _fakeAudioContext;
    function FakeAudioContext() {
      return _fakeAudioContext;
    }
    const fakeRandomizer = () => [I, O, J, L, S, T, Z];
    const _ = '';
    const i = 'I';
    const o = 'O';
    const x = 'ghost-piece';
    const emptyLines = (n) =>
      [...Array(n)].map(() => [...Array(10)].map(() => ''));

    beforeEach(() => {
      _timers = sinon.useFakeTimers();
      _fakeBufferSource = { connect: sinon.spy(), start: sinon.spy() };
      _fakeAudioContext = {
        decodeAudioData: sinon.stub().resolves('fakeAudioData'),
        createBufferSource: () => _fakeBufferSource
      };
      globalThis.fetch = sinon
        .stub()
        .resolves({ arrayBuffer: () => new ArrayBuffer(0) });
    });
    afterEach(() => {
      _timers.restore();
    });

    const renderGame = () => {
      const Game = GameFactory(
        UseGameReducer(Player(FakeAudioContext), fakeRandomizer)
      );
      return render(<Game />);
    };
    it('shows playfield', () => {
      renderGame();
      const playfield = screen.getByTestId('playfield');
      const rows = [...playfield.childNodes];
      expect(rows.length).to.equal(22);
      expect(
        rows.every((child) => child.querySelectorAll('div').length === 10)
      ).to.equal(true);
    });
    const tick = (ms, n) =>
      [...Array(n)].reduce(
        (acc) =>
          acc.then(() => {
            _timers.tick(ms);
            return waitFor(() => undefined);
          }),
        Promise.resolve()
      );

    const play = async () => {
      const button = screen.getByText('START');
      fireEvent.click(button);
      await tick(1000);
      await tick(1000);
      await tick(1000);
    };

    it('counts down when play and resume are clicked', async () => {
      renderGame();
      const playButton = screen.getByText('START');
      fireEvent.click(playButton);
      expect(screen.queryByText('START')).to.equal(null);
      screen.getByText('3');
      await tick(1000, 1);
      screen.getByText('2');
      await tick(1000, 1);
      screen.getByText('1');
      await tick(1000, 1);
      expect(screen.queryByText('1')).to.equal(null);
      await tick(1000, 1);
      fireEvent.keyDown(document.body, { key: 'Escape' });
      const resumeButton = screen.getByText('RESUME');
      fireEvent.click(resumeButton);
      expect(screen.queryByText('RESUME')).to.equal(null);
      screen.getByText('3');
      await tick(1000, 1);
      screen.getByText('2');
      await tick(1000, 1);
      screen.getByText('1');
      await tick(1000, 1);
      expect(screen.queryByText('1')).to.equal(null);
    });
    it('falls down and gets a new tetromino', async () => {
      renderGame();
      await play();
      const playfield = screen.getByTestId('playfield');
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(1),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(19),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      await tick(1000, 1);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(2),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(18),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      await tick(1000, 19);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(21),
        [_, _, _, i, i, i, i, _, _, _]
      ]);
      //locks after 500ms
      await tick(500, 1);
      //clears lines after 500ms
      await tick(500, 1);
      expect(readCells(playfield)).to.deep.equal([
        [_, _, _, _, o, o, _, _, _, _],
        [_, _, _, _, o, o, _, _, _, _],
        ...emptyLines(17),
        [_, _, _, _, x, x, _, _, _, _],
        [_, _, _, _, x, x, _, _, _, _],
        [_, _, _, i, i, i, i, _, _, _]
      ]);
    });

    it('moves', async () => {
      renderGame();
      await play();
      const playfield = screen.getByTestId('playfield');
      fireEvent.keyDown(document.body, {
        key: 't'
      });
      fireEvent.keyDown(document.body, {
        key: 'ArrowLeft'
      });
      await waitFor(() => undefined);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(1),
        [_, _, i, i, i, i, _, _, _, _],
        ...emptyLines(19),
        [_, _, x, x, x, x, _, _, _, _]
      ]);
      fireEvent.keyDown(document.body, {
        key: 'ArrowRight'
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(1),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(19),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown'
      });
      fireEvent.keyUp(document.body, {
        key: 'ArrowDown'
      });

      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(2),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(18),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyDown(document.body, {
        key: 'ArrowUp'
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(1),
        [_, _, _, _, _, i, _, _, _, _],
        [_, _, _, _, _, i, _, _, _, _],
        [_, _, _, _, _, i, _, _, _, _],
        [_, _, _, _, _, i, _, _, _, _],
        ...emptyLines(13),
        [_, _, _, _, _, x, _, _, _, _],
        [_, _, _, _, _, x, _, _, _, _],
        [_, _, _, _, _, x, _, _, _, _],
        [_, _, _, _, _, x, _, _, _, _]
      ]);
      fireEvent.keyDown(document.body, {
        key: 'z'
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(2),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(18),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyDown(document.body, {
        key: ' '
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(21),
        [_, _, _, i, i, i, i, _, _, _]
      ]);
    });
    it('auto repeats down with a delay (soft drop)', async () => {
      renderGame();
      await play();
      const playfield = screen.getByTestId('playfield');
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown'
      });
      const expectedInterval = 33;
      await tick(99, 1);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(2),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(18),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      await tick(1, 1);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(3),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(17),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyUp(document.body, {
        key: 'w'
      });
      await tick(expectedInterval, 1);
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(4),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(16),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyUp(document.body, {
        key: 'ArrowDown'
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(4),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(16),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
    });
    it('ignores keyboards auto repeat when going down', async () => {
      renderGame();
      await play();
      const playfield = screen.getByTestId('playfield');
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown'
      });
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown',
        repeat: true
      });
      expect(readCells(playfield)).to.deep.equal([
        ...emptyLines(2),
        [_, _, _, i, i, i, i, _, _, _],
        ...emptyLines(18),
        [_, _, _, x, x, x, x, _, _, _]
      ]);
      fireEvent.keyUp(document.body, {
        key: 'ArrowDown'
      });
    });
    it('holds when c is pressed', async () => {
      renderGame();
      await play();
      await waitFor(() => undefined);
      fireEvent.keyDown(document.body, { key: 'c' });
      const held = screen
        .getByText('HOLD')
        .parentNode.querySelector('.small-tetromino');
      expect(readCells(held)).to.deep.equal([
        ['', '', '', ''],
        ['I', 'I', 'I', 'I'],
        ['', '', '', ''],
        ['', '', '', '']
      ]);
    });
  });
});
