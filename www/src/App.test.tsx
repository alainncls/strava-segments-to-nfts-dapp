import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { setupClient } from './test';
import Home from './screens/Home/Home';
import { WagmiConfig } from 'wagmi';

jest.mock('connectkit', () => ({
  ConnectKitButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return React.createElement('MockButton');
  },
}));

test('renders app', () => {
  render(
    <WagmiConfig client={setupClient()}>
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <Home />
      </MemoryRouter>
    </WagmiConfig>
  );
  const headerElement = screen.getByRole('navigation');
  expect(headerElement).toBeInTheDocument();

  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});
