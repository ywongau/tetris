import { act, renderHook } from '@testing-library/react-hooks';

import { I } from '../../constants/tetrominos';
import { Player } from '../../sfx/player';
import { expect } from 'chai';
import sinon from 'sinon';

const { UseGameReducer } = require('./useGameReducer');
const fakeRandomizer = () => [I, I, I, I, I];

describe('useGameReducer', () => {
  let _timers;
  let _fakeBufferSource;
  let _fakeAudioContext;
  function FakeAudioContext() {
    return _fakeAudioContext;
  }
  const tick = (ms) =>
    act(() => {
      _timers.tick(ms);
    });
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

  const softDrop = (height) => {
    //descend
    tick(height * 1000);
    //lock
    tick(500);
    //clear
    tick(500);
    //spawn
    tick(500);
  };

  const play = (start) => {
    start();
    tick(1000);
    tick(1000);
    tick(1000);
    tick(1000);
  };

  it('appends a new queue when there are 3 items in queue', async () => {
    const hook = UseGameReducer(Player(FakeAudioContext), fakeRandomizer);
    const { result } = renderHook(() => hook());
    play(result.current.start);
    softDrop(20);
    softDrop(19);
    expect(result.current.state.queue).to.deep.equal([I, I, I, I, I, I, I]);
  });
  it('dies', async () => {
    const hook = UseGameReducer(Player(FakeAudioContext), fakeRandomizer);
    const { result } = renderHook(() => hook());
    play(result.current.start);
    for (let i = 20; i >= 1; i--) {
      softDrop(i);
    }
    softDrop(0);
    softDrop(0);
    //spawn
    expect(result.current.state.alive).to.equal(false);
    expect(result.current.tetromino).to.equal(undefined);
    tick(1000);
    expect(result.current.tetromino).to.equal(undefined);
  });
});
