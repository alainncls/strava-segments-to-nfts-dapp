import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Home from './Home';
import { Activity } from '../../types/activity';

jest.mock('connectkit', () => ({
  ConnectKitButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return React.createElement('MockButton');
  },
}));

const activity1: Activity = {
  id: 'ID 1',
  name: 'Activity 1',
  stravaId: 1234,
  start_date: '2022-06-03T18:02:13Z',
  matchingSegmentsIds: [2],
  segmentsIds: [1, 2, 3],
  segmentsPictures: ['ipfs://ipfsCID1'],
  transactionsHashes: ['0x12345'],
};
const activity2: Activity = {
  id: 'ID 2',
  name: 'Activity 2',
  stravaId: 5678,
  start_date: '2022-06-02T18:02:13Z',
  matchingSegmentsIds: [1],
  segmentsIds: [1, 2],
  segmentsPictures: ['ipfs://ipfsCID2'],
  transactionsHashes: ['0x67890'],
};
const activities = [activity1, activity2];

beforeEach(() => {
  window.sessionStorage.clear();

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(activities),
    })
  ) as jest.Mock;
});

test('renders home component with login button if no token', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/' }]}>
      <Home />
    </MemoryRouter>
  );
  const headerElement = screen.getByRole('navigation');
  expect(headerElement).toBeInTheDocument();

  const imageElement = screen.getByAltText('Strava connect button');
  expect(imageElement).toBeInTheDocument();

  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});

test('renders home component with activities if the access token is found', async () => {
  window.sessionStorage.setItem('accessToken', 'accessToken');
  window.sessionStorage.setItem('refreshToken', 'refreshToken');
  window.sessionStorage.setItem('tokenCreationDate', Date().toString());

  render(
    <MemoryRouter initialEntries={[{ pathname: '/' }]}>
      <Home />
    </MemoryRouter>
  );
  const headerElement = screen.getByRole('navigation');
  expect(headerElement).toBeInTheDocument();

  const imageElement = screen.queryAllByAltText('Strava connect button');
  expect(imageElement).toHaveLength(0);

  const activity1Element = await screen.findByText(activity1.name);
  expect(activity1Element).toBeInTheDocument();

  const activity2Element = await screen.findByText(activity2.name);
  expect(activity2Element).toBeInTheDocument();

  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});

test('renders home component with token refreshing feature', async () => {
  window.sessionStorage.setItem('accessToken', 'accessToken');
  window.sessionStorage.setItem('refreshToken', 'refreshToken');
  window.sessionStorage.setItem(
    'tokenCreationDate',
    new Date('Wed Jun 07 2022 22:42:25').toString()
  );

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          refresh_token: 'newRefreshToken',
          access_token: 'newAccessToken',
        }),
    })
  ) as jest.Mock;

  render(
    <MemoryRouter initialEntries={[{ pathname: '/' }]}>
      <Home />
    </MemoryRouter>
  );

  await new Promise(process.nextTick);

  expect(window.sessionStorage.getItem('accessToken')).toEqual(
    'newAccessToken'
  );
  expect(window.sessionStorage.getItem('refreshToken')).toEqual(
    'newRefreshToken'
  );
});

test('renders home component able to find matching segments', async () => {
  window.sessionStorage.setItem('accessToken', 'accessToken');
  window.sessionStorage.setItem('refreshToken', 'refreshToken');
  window.sessionStorage.setItem('tokenCreationDate', Date().toString());

  render(
    <MemoryRouter initialEntries={[{ pathname: '/' }]}>
      <Home />
    </MemoryRouter>
  );

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          activity: {
            matchingSegmentsIds: ['12345'],
            segmentsPictures: ['ipfs://cid'],
          },
        }),
    })
  ) as jest.Mock;

  const modalElement = screen.queryByText('Eligible segments');
  expect(modalElement).not.toBeInTheDocument();

  const activity1Element = await screen.findByText(activity1.name);
  expect(activity1Element).toBeInTheDocument();

  const buttonElements = screen.queryAllByText('Check for eligible segments');
  expect(buttonElements).toHaveLength(2);

  fireEvent(
    buttonElements[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  const visbleModalElement = await screen.findByText('Eligible segments');
  expect(visbleModalElement).toBeInTheDocument();

  const buttonElement = await screen.findByText('Mint NFTs');
  expect(buttonElement).toBeInTheDocument();

  fireEvent(
    buttonElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  await waitFor(() => {
    expect(screen.queryByText('Eligible segments')).not.toBeInTheDocument();
  });
});
