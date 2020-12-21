import { cleanup, render, screen } from '@testing-library/react';

import App from './App';
import React from 'react';

describe('app', () => {
  afterEach(cleanup);
  it('works', () => {
    render(<App />);
  });
});
