import React from 'react';
import { expect, test } from 'vitest';
import Footer from './Footer';
import { render, screen } from '../../test/utils';

test('renders footer', () => {
  render(<Footer />);
  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});
