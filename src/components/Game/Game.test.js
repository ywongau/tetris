import { I, J, L, O, S, T, Z } from '../../constants/tetrominos';
import {
  cleanup,
  findByTitle,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import { Audio } from '../../sfx/audio';
import GameFactory from './Game';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { phases } from '../../constants/phases';

const { UseGameReducer } = require('./useGameReducer');
describe('Game', () => {
  beforeEach(() => {});
  afterEach(cleanup);
  describe('Game with fake hooks', () => {
    it('shows animation when clearedPlayfield lines', async () => {
      const fakeHook = () => ({
        state: {
          playfield: [...Array(20)].map((_, y) =>
            [...Array(10)].map(() => (y === 19 ? 'I' : undefined))
          ),
          tetromino: I,
          phase: phases.clearing,
          queue: [J, L, O, S, T, Z]
        }
      });
      const Game = GameFactory(fakeHook);
      render(<Game />);
      const playfield = screen.getByTestId('playfield');
      const lastRow = playfield.childNodes[19];
      expect(lastRow.classList.contains('clearing')).to.equal(true);
    });
    it('shows next and  lines', async () => {
      const fakeHook = () => ({
        state: {
          playfield: [...Array(20)].map((_, y) =>
            [...Array(10)].map(() => (y === 19 ? 'I' : undefined))
          ),
          tetromino: I,
          phase: phases.descending,
          queue: [J, L, O, S, T, Z],
          lines: 3
        }
      });
      const Game = GameFactory(fakeHook);
      const { container } = render(<Game />);
      screen.getByText('NEXT');
      screen.getByText('LINES');
      screen.getByText('3');
      const nextTetrominos = container.querySelectorAll('.next-tetromino');
      const getNextTetromino = (n) =>
        [...nextTetrominos[n].querySelectorAll('.row')].map((row) =>
          [...row.querySelectorAll('div')].map((cell) => cell.className)
        );
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
  });

  describe('Game integration tests', () => {
    let _timers;
    let _fakeBufferSource;
    let _fakeAudioContext;
    const fakeRandomizer = () => [I, O, J, L, S, T, Z];
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
        UseGameReducer(
          Audio(() => _fakeAudioContext),
          fakeRandomizer
        )
      );
      render(<Game />);
    };
    it('shows playfield', () => {
      renderGame();
      const playfield = screen.getByTestId('playfield');
      const rows = [...playfield.childNodes];
      expect(rows.length).to.equal(20);
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
      const button = screen.getByText('PLAY');
      fireEvent.click(button);
      await tick(1000);
      await tick(1000);
      await tick(1000);
    };

    it('counts down when play and resume are clicked', async () => {
      renderGame();
      const playButton = screen.getByText('PLAY');
      fireEvent.click(playButton);
      expect(screen.queryByText('PLAY')).to.equal(null);
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
      const cells = [...playfield.childNodes].map((row) => [...row.childNodes]);
      expect(cells[1][3].className).to.equal('I');
      expect(cells[1][4].className).to.equal('I');
      expect(cells[1][5].className).to.equal('I');
      expect(cells[1][6].className).to.equal('I');
      await tick(1000, 1);
      expect(cells[2][3].className).to.equal('I');
      expect(cells[2][4].className).to.equal('I');
      expect(cells[2][5].className).to.equal('I');
      expect(cells[2][6].className).to.equal('I');
      await tick(1000, 17);
      expect(cells[19][3].className).to.equal('I');
      expect(cells[19][4].className).to.equal('I');
      expect(cells[19][5].className).to.equal('I');
      expect(cells[19][6].className).to.equal('I');
      //locks after 500ms
      await tick(500, 1);
      //clears lines after 500ms
      await tick(500, 1);
      //spawns after 500ms
      await tick(500, 1);
      expect(cells[0][4].className).to.equal('O');
      expect(cells[1][4].className).to.equal('O');
      expect(cells[1][5].className).to.equal('O');
      expect(cells[1][5].className).to.equal('O');
    });

    it('moves', async () => {
      renderGame();
      await play();
      const playfield = screen.getByTestId('playfield');
      const cells = [...playfield.childNodes].map((row) => [...row.childNodes]);
      fireEvent.keyDown(document.body, {
        key: 't'
      });
      fireEvent.keyDown(document.body, {
        key: 'ArrowLeft'
      });
      await waitFor(() => undefined);
      expect(cells[1][2].className).to.equal('I');
      expect(cells[1][3].className).to.equal('I');
      expect(cells[1][4].className).to.equal('I');
      expect(cells[1][5].className).to.equal('I');
      fireEvent.keyDown(document.body, {
        key: 'ArrowRight'
      });
      expect(cells[1][3].className).to.equal('I');
      expect(cells[1][4].className).to.equal('I');
      expect(cells[1][5].className).to.equal('I');
      expect(cells[1][6].className).to.equal('I');
      fireEvent.keyDown(document.body, {
        key: 'ArrowDown'
      });
      expect(cells[2][3].className).to.equal('I');
      expect(cells[2][4].className).to.equal('I');
      expect(cells[2][5].className).to.equal('I');
      expect(cells[2][6].className).to.equal('I');
      fireEvent.keyDown(document.body, {
        key: 'ArrowUp'
      });
      expect(cells[1][5].className).to.equal('I');
      expect(cells[2][5].className).to.equal('I');
      expect(cells[3][5].className).to.equal('I');
      expect(cells[4][5].className).to.equal('I');
      fireEvent.keyDown(document.body, {
        key: 'z'
      });
      expect(cells[2][3].className).to.equal('I');
      expect(cells[2][4].className).to.equal('I');
      expect(cells[2][5].className).to.equal('I');
      expect(cells[2][6].className).to.equal('I');
      fireEvent.keyDown(document.body, {
        key: ' '
      });
      expect(cells[19][3].className).to.equal('I');
      expect(cells[19][4].className).to.equal('I');
      expect(cells[19][5].className).to.equal('I');
      expect(cells[19][6].className).to.equal('I');
    });
  });
});
