import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import Game from './Game';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Game', () => {
  let _timers;
  beforeEach(async () => {
    _timers = sinon.useFakeTimers();
  });
  afterEach(async () => {
    _timers.restore();
    await cleanup();
  });
  it('shows empty playfield', () => {
    render(<Game />);
    const playfield = screen.getByTestId('playfield');
    const rows = [...playfield.childNodes];
    expect(rows.length).to.equal(40);
    expect(
      rows.every((child) => child.querySelectorAll('div').length === 10)
    ).to.equal(true);
  });
  it('shows play button', () => {
    render(<Game />);
    screen.getByText('PLAY');
  });
  it('starts the game after clicking PLAY', async () => {
    render(<Game />);
    const button = screen.getByText('PLAY');
    fireEvent.click(button);
    screen.getByText('3');
    _timers.tick(1000);
    await screen.findByText('2');
    _timers.tick(1000);
    await screen.findByText('1');
    _timers.tick(1000);
    const countdown = await screen.queryByTestId('countdown');
    expect(countdown).to.equal(null);
  });
});
