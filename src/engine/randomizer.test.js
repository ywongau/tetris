import { I, J, L, O, S, T, Z } from './tetrominoes';

import { expect } from 'chai';
import { randomizer } from './randomizer';
import sinon from 'sinon';

// https://tetris.fandom.com/wiki/Tetris_Guideline
describe('randomizer', () => {
  describe('forcing random to be 0.9', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.9);
    });
    afterEach(() => {
      Math.random.restore();
    });
    it('shuffles with Fisher–Yates', () => {
      expect(randomizer()).to.deep.equal([I, O, T, S, Z, J, L]);
    });
  });
  describe('forcing random to be 0.1', () => {
    beforeEach(() => {
      sinon.stub(Math, 'random').returns(0.1);
    });
    afterEach(() => {
      Math.random.restore();
    });
    it('shuffles with Fisher–Yates', () => {
      expect(randomizer()).to.deep.equal([O, T, S, Z, J, L, I]);
    });
  });
});
