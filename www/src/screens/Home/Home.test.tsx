import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import Home from './Home';
import { WagmiConfig } from 'wagmi';
import { setupClient } from '../../test';
import { Activity } from '../../types';

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
  start_date: '2022-06-03T18:02:13Z',
};
const activity2: Activity = {
  id: 'ID 2',
  name: 'Activity 2',
  start_date: '2022-06-02T18:02:13Z',
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
    <WagmiConfig client={setupClient()}>
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <Home />
      </MemoryRouter>
    </WagmiConfig>
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

test('renders home component able to find segments in activities', async () => {
  window.sessionStorage.setItem('accessToken', 'accessToken');
  window.sessionStorage.setItem('refreshToken', 'refreshToken');
  window.sessionStorage.setItem('tokenCreationDate', Date().toString());

  render(
    <WagmiConfig client={setupClient()}>
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <Home />
      </MemoryRouter>
    </WagmiConfig>
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

  const modalElement = screen.queryByText('Segments in');
  expect(modalElement).not.toBeInTheDocument();

  const activity1Element = await screen.findByText(activity1.name);
  expect(activity1Element).toBeInTheDocument();

  const activity2Element = await screen.findByText(activity2.name);
  expect(activity2Element).toBeInTheDocument();

  const buttonElements = screen.queryAllByText('Check for eligible segments');
  expect(buttonElements).toHaveLength(activities.length);
});
