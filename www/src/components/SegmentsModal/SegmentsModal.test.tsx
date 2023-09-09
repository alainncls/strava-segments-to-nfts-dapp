import React from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import SegmentsModal from './SegmentsModal';
import { setupConfig } from '../../test';
import { WagmiConfig } from 'wagmi';
import { Activity } from '../../types';
import { render, screen } from '../../test/utils';
import { fireEvent } from '@testing-library/react';

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
      metadata: undefined,
      picture: undefined,
    },
  ],
};

beforeEach(() => {
  displayModal = true;
  onHide = vi.fn();
});

test('renders visible modal', () => {
  render(
    <WagmiConfig config={setupConfig()}>
      <SegmentsModal
        displayModal={displayModal}
        onHide={onHide}
        activity={activity}
      />
    </WagmiConfig>
  );
  const buttonElement = screen.getByText(`Segments in ${activity.name}`);
  expect(buttonElement).toBeInTheDocument();
});

test('renders invisible modal', () => {
  displayModal = false;

  render(
    <WagmiConfig config={setupConfig()}>
      <SegmentsModal
        displayModal={displayModal}
        onHide={onHide}
        activity={activity}
      />
    </WagmiConfig>
  );
  const modalElement = screen.queryByText(`Segments in ${activity.name}`);
  expect(modalElement).not.toBeInTheDocument();
});

test('renders closable modal', () => {
  render(
    <WagmiConfig config={setupConfig()}>
      <SegmentsModal
        displayModal={displayModal}
        onHide={onHide}
        activity={activity}
      />
    </WagmiConfig>
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
