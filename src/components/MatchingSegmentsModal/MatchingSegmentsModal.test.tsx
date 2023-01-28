import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchingSegmentsModal from './MatchingSegmentsModal';

let displayModal: boolean;
let onHide: () => void;

beforeEach(() => {
  displayModal = true;
  onHide = jest.fn();
});

test('renders visible modal', () => {
  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const buttonElement = screen.getByText('Segments in');
  expect(buttonElement).toBeInTheDocument();
});

test('renders invisible modal', () => {
  displayModal = false;

  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const modalElement = screen.queryByText('Segments in');
  expect(modalElement).not.toBeInTheDocument();
});

test('renders closable modal', () => {
  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const closeButtonElement = screen.getByText('Close');
  expect(closeButtonElement).toBeInTheDocument();
  fireEvent(
    closeButtonElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(onHide).toHaveBeenCalled();
});
