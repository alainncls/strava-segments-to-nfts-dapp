import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchingSegmentsModal from './MatchingSegmentsModal';
import { Activity } from '../../types/activity';

let displayModal: boolean;
let onHide: () => void;
const activity: Activity = {
  id: 'ID 1',
  name: 'Activity 1',
  start_date: '2022-06-03T18:02:13Z',
  segments: [
    {
      id: 123456,
      type: 'Ride',
      title: 'Cool segment',
      distance: 123,
      polyline: [[1, 1]],
      pictureLink: undefined,
      picture: undefined,
    },
  ],
};

beforeEach(() => {
  displayModal = true;
  onHide = jest.fn();
});

test('renders visible modal', () => {
  render(
    <MatchingSegmentsModal
      displayModal={displayModal}
      onHide={onHide}
      activity={activity}
    />
  );
  const buttonElement = screen.getByText(`Segments in ${activity.name}`);
  expect(buttonElement).toBeInTheDocument();
});

test('renders invisible modal', () => {
  displayModal = false;

  render(
    <MatchingSegmentsModal
      displayModal={displayModal}
      onHide={onHide}
      activity={activity}
    />
  );
  const modalElement = screen.queryByText(`Segments in ${activity.name}`);
  expect(modalElement).not.toBeInTheDocument();
});

test('renders closable modal', () => {
  render(
    <MatchingSegmentsModal
      displayModal={displayModal}
      onHide={onHide}
      activity={activity}
    />
  );
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
