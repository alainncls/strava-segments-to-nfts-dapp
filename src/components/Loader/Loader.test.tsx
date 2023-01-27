import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Loader from './Loader';

test('renders loading spinner', () => {
  render(<Loader loading={true} />);
  const spinnerElement = screen.getByRole('status');
  expect(spinnerElement).toBeInTheDocument();
});

test('renders no loading spinner', () => {
  render(<Loader loading={false} />);
  const spinnerElement = screen.queryByRole('status');
  expect(spinnerElement).not.toBeInTheDocument();
});
