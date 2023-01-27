import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StravaLoginButton from './StravaLoginButton';

test('renders link to launch Strava login', () => {
  render(<StravaLoginButton />);
  const linkElement = screen.getByRole('link');
  expect(linkElement).toBeInTheDocument();
});

test('renders official Connect with Strava image', () => {
  render(<StravaLoginButton />);
  const imageElement = screen.getByAltText('Strava connect button');
  expect(imageElement).toBeInTheDocument();
});
