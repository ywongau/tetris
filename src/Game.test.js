import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

import Game from './Game';
import React from 'react';
import { directions } from './engine/actions';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Game', () => {
  let _timers;
  beforeEach(async () => {
    _timers = sinon.useFakeTimers();
    sinon.stub(Math, 'random').returns(0.9);
  });
  afterEach(async () => {
    _timers.restore();
    Math.random.restore();
    await cleanup();
  });
  it('shows empty playfield', () => {
    render(<Game />);
    const playfield = screen.getByTestId('playfield');
    const rows = [...playfield.childNodes];
    expect(rows.length).to.equal(20);
    expect(
      rows.every((child) => child.querySelectorAll('div').length === 10)
    ).to.equal(true);
  });
  // it('shows play button', () => {
  //   render(<Game />);
  //   screen.getByText('PLAY');
  // });

  const tick = (n) =>
    [...Array(n)].reduce(
      (acc) =>
        acc.then(() => {
          _timers.tick(1000);
          return waitFor(() => undefined);
        }),
      Promise.resolve()
    );
  it('starts the game after clicking PLAY', async () => {
    const x = render(<Game />);
    // const button = screen.getByText('PLAY');
    // fireEvent.click(button);
    // screen.getByText('3');
    // _timers.tick(1000);
    // await screen.findByText('2');
    // _timers.tick(1000);
    // await screen.findByText('1');
    // _timers.tick(1000);
    // const countdown = await screen.queryByTestId('countdown');
    // expect(countdown).to.equal(null);
    const playfield = screen.getByTestId('playfield');
    const cells = [...playfield.childNodes].map((row) => [...row.childNodes]);
    await tick(1);
    // await tick(1);

    expect(cells[0][4].className).to.equal('I');
    expect(cells[1][4].className).to.equal('I');
    expect(cells[2][4].className).to.equal('I');
    expect(cells[3][4].className).to.equal('I');
    await tick(1);
    expect(cells[0][4].className).to.equal('');
    expect(cells[1][4].className).to.equal('I');
    expect(cells[2][4].className).to.equal('I');
    expect(cells[3][4].className).to.equal('I');
    expect(cells[4][4].className).to.equal('I');

    await tick(15);

    expect(cells[15][4].className).to.equal('');
    expect(cells[16][4].className).to.equal('I');
    expect(cells[17][4].className).to.equal('I');
    expect(cells[18][4].className).to.equal('I');
    expect(cells[19][4].className).to.equal('I');
    await tick(1);

    expect(cells[0][4].className).to.equal('O');
    expect(cells[1][4].className).to.equal('O');
    expect(cells[1][5].className).to.equal('O');
    expect(cells[1][5].className).to.equal('O');
  });

  it.only('turns left', async () => {
    const x = render(<Game />);
    // const button = screen.getByText('PLAY');
    // fireEvent.click(button);
    // screen.getByText('3');
    // _timers.tick(1000);
    // await screen.findByText('2');
    // _timers.tick(1000);
    // await screen.findByText('1');
    // _timers.tick(1000);
    // const countdown = await screen.queryByTestId('countdown');
    // expect(countdown).to.equal(null);
    const playfield = screen.getByTestId('playfield');
    const cells = [...playfield.childNodes].map((row) => [...row.childNodes]);
    await tick(1);
    // await tick(1);

    expect(cells[0][4].className).to.equal('I');
    expect(cells[1][4].className).to.equal('I');
    expect(cells[2][4].className).to.equal('I');
    expect(cells[3][4].className).to.equal('I');
    fireEvent.keyDown(document.body, {
      keyCode: directions.left
    });
    await tick(1);
    expect(cells[0][3].className).to.equal('');
    expect(cells[1][3].className).to.equal('I');
    expect(cells[2][3].className).to.equal('I');
    expect(cells[3][3].className).to.equal('I');
    expect(cells[4][3].className).to.equal('I');
  });
});
