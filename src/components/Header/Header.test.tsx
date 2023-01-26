import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';
import React from 'react';

const connectKitTestId = 'connect-kit-button';

jest.mock('connectkit', () => ({
  ConnectKitButton: () => {
    const React = require('react');
    return React.createElement('MockButton', { 'data-testid': connectKitTestId });
  },
}));

test('renders header', () => {
  render(<Header />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByText('Strava Segments to NFTs')).toBeInTheDocument();
  expect(screen.getAllByRole('link')).toHaveLength(4);
  expect(screen.queryByTestId(connectKitTestId)).toBeInTheDocument();
});
