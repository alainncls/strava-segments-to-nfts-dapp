import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Activities from './Activities';
import { Activity } from '../../types/activity';

let activities: Activity[];
let checkForSegments: (activityId: string) => void;
let displaySegments: (activityId: string) => void;

beforeEach(() => {
  activities = [
    {
      id: 'ID 1',
      name: 'Activity 1',
      stravaId: 1234,
      start_date: '2022-06-03T18:02:13Z',
      matchingSegmentsIds: [2],
      segmentsIds: [1, 2, 3],
      segmentsPictures: ['ipfs://ipfsCID1'],
      transactionsHashes: ['0x12345'],
    },
    {
      id: 'ID 2',
      name: 'Activity 2',
      stravaId: 5678,
      start_date: '2022-06-02T18:02:13Z',
      matchingSegmentsIds: [1],
      segmentsIds: [1, 2],
      segmentsPictures: ['ipfs://ipfsCID2'],
      transactionsHashes: ['0x67890'],
    },
  ];
  checkForSegments = jest.fn();
});

test('renders activities', () => {
  render(
    <Activities
      activities={activities}
      checkForSegments={checkForSegments}
      displaySegments={displaySegments}
    />
  );
  const activity1Element = screen.getByText(activities[0].name);
  expect(activity1Element).toBeInTheDocument();
  const activity2Element = screen.getByText(activities[1].name);
  expect(activity2Element).toBeInTheDocument();
});

test('renders activities with ability to check segments', () => {
  render(
    <Activities
      activities={activities}
      checkForSegments={checkForSegments}
      displaySegments={displaySegments}
    />
  );
  const buttonElements = screen.getAllByText('Check for eligible segments');
  expect(buttonElements).toHaveLength(2);

  fireEvent(
    buttonElements[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(checkForSegments).toHaveBeenCalledWith(activities[0].id);

  fireEvent(
    buttonElements[1],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(checkForSegments).toHaveBeenCalledWith(activities[1].id);
});
