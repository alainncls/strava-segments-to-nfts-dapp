import { expect, test, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { setupConfig } from './test';
import Home from './screens/Home/Home';
import { WagmiConfig } from 'wagmi';
import { render, screen } from './test/utils';

vi.mock('connectkit', () => ({
  ConnectKitButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return React.createElement('MockButton');
  },
}));

test('renders app', () => {
  render(
    <WagmiConfig config={setupConfig()}>
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <Home />
      </MemoryRouter>
    </WagmiConfig>
  );
  const headerElement = screen.getByRole('banner');
  expect(headerElement).toBeInTheDocument();

  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});
