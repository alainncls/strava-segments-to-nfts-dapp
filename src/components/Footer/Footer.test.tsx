import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './Footer';

test('renders footer', () => {
  render(<Footer />);
  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});
