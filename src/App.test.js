import { cleanup, render, screen } from '@testing-library/react';

import App from './App';
import React from 'react';

describe('app', () => {
  beforeEach(cleanup);
  it('works', () => {
    render(<App />);
    screen.getByText(/learn react/i);
  });
});
