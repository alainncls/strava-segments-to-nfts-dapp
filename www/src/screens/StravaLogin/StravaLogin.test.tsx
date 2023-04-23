import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StravaLogin from './StravaLogin';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

jest.mock('connectkit', () => ({
  ConnectKitButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');
    return React.createElement('MockButton');
  },
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          refresh_token: 'refreshToken',
          access_token: 'accessToken',
        }),
    })
  ) as jest.Mock;
});

test('renders component to intercept the oauth2 callback', () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/oauth' }]}>
      <StravaLogin />
    </MemoryRouter>
  );
  const headerElement = screen.getByRole('navigation');
  expect(headerElement).toBeInTheDocument();

  const footerElement = screen.getByRole('contentinfo');
  expect(footerElement).toBeInTheDocument();
});

test('renders a closable error toast if callback has incomplete scope', async () => {
  render(
    <MemoryRouter
      initialEntries={[
        { pathname: '/oauth', search: '?code=authCode&scope=read,read_all' },
      ]}
    >
      <StravaLogin />
    </MemoryRouter>
  );

  let toastElement = screen.getByTestId('toast-error');
  expect(toastElement).toBeInTheDocument();
  expect(toastElement).toBeVisible();

  fireEvent(
    toastElement,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  );

  toastElement = screen.getByTestId('toast-error');
  expect(toastElement).not.toBeInTheDocument();
  expect(toastElement).not.toBeVisible();
});

test('renders no error if callback is complete', async () => {
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/oauth',
          search:
            '?code=authCode&scope=read,activity:read,activity:read_all,read_all',
        },
      ]}
    >
      <StravaLogin />
    </MemoryRouter>
  );

  await new Promise(process.nextTick);

  const toastElement = screen.queryByTestId('toast-error');
  expect(toastElement).not.toBeInTheDocument();

  expect(window.sessionStorage.getItem('accessToken')).toEqual('accessToken');
  expect(window.sessionStorage.getItem('refreshToken')).toEqual('refreshToken');
});
