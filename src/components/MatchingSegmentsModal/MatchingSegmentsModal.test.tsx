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
  const buttonElement = screen.getByText('Eligible segments');
  expect(buttonElement).toBeInTheDocument();
});

test('renders invisible modal', () => {
  displayModal = false;

  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const modalElement = screen.queryByText('Eligible segments');
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

test('renders modal with mint action', () => {
  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const mintButtonElement = screen.getByText('Mint NFTs');
  expect(mintButtonElement).toBeInTheDocument();
  fireEvent(
    mintButtonElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
});

test('renders modal with segments displayed', () => {
  render(<MatchingSegmentsModal displayModal={displayModal} onHide={onHide} />);
  const segment1IdElement = screen.getByText(/1234/i);
  expect(segment1IdElement).toBeInTheDocument();
  const segment1PictureElement = screen.getByAltText(/Segment 1234/i);
  expect(segment1PictureElement).toBeInTheDocument();

  const segment2IdElement = screen.getByText(/5678/i);
  expect(segment2IdElement).toBeInTheDocument();
  const segment2PictureElement = screen.getByAltText(/Segment 5678/i);
  expect(segment2PictureElement).toBeInTheDocument();
});
