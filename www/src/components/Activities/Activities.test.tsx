import React from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import Activities from './Activities';
import { Activity } from '../../types';
import { render, screen } from '../../test/utils';
import { fireEvent } from '@testing-library/react';

let activities: Activity[];
let checkForSegments: (activityId: string) => void;
let displaySegments: (activityId: string) => void;

beforeEach(() => {
  activities = [
    {
      id: 'ID 1',
      name: 'Activity 1',
      start_date: '2022-06-03T18:02:13Z',
    },
    {
      id: 'ID 2',
      name: 'Activity 2',
      start_date: '2022-06-02T18:02:13Z',
    },
  ];
  checkForSegments = vi.fn();
  displaySegments = vi.fn();
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

test('renders activities with ability to display segments', () => {
  activities[0].segments = [
    { id: 123, title: 'title', distance: 123, type: 'type' },
  ];
  render(
    <Activities
      activities={activities}
      checkForSegments={checkForSegments}
      displaySegments={displaySegments}
    />
  );
  const buttonElements = screen.getAllByText('1 segments');
  expect(buttonElements).toHaveLength(1);

  fireEvent(
    buttonElements[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );
  expect(displaySegments).toHaveBeenCalledWith(activities[0].id);
});
