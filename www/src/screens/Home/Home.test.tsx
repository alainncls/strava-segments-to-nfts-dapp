import { beforeEach, expect, Mock, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Home from "./Home";
import { Activity } from "../../types";
import { render, screen } from "@testing-library/react";

const activity1: Activity = {
  id: "ID 1",
  name: "Activity 1",
  start_date: "2022-06-03T18:02:13Z",
};
const activity2: Activity = {
  id: "ID 2",
  name: "Activity 2",
  start_date: "2022-06-02T18:02:13Z",
};
const activities = [activity1, activity2];

beforeEach(() => {
  window.sessionStorage.clear();

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(activities),
    }),
  ) as Mock;
});

test("renders home component with login button if no token", () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>,
  );
  const headerElement = screen.getByRole("banner");
  expect(headerElement).toBeInTheDocument();

  const imageElement = screen.getByAltText("Strava connect button");
  expect(imageElement).toBeInTheDocument();

  const footerElement = screen.getByRole("contentinfo");
  expect(footerElement).toBeInTheDocument();
});

test("renders home component with activities if the access token is found", async () => {
  window.sessionStorage.setItem("accessToken", "accessToken");
  window.sessionStorage.setItem("refreshToken", "refreshToken");
  window.sessionStorage.setItem("tokenExpirationDate", Date().toString());

  render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>,
  );
  const headerElement = screen.getByRole("banner");
  expect(headerElement).toBeInTheDocument();

  const imageElement = screen.queryAllByAltText("Strava connect button");
  expect(imageElement).toHaveLength(0);

  const activity1Element = await screen.findByText(activity1.name);
  expect(activity1Element).toBeInTheDocument();

  const activity2Element = await screen.findByText(activity2.name);
  expect(activity2Element).toBeInTheDocument();

  const footerElement = screen.getByRole("contentinfo");
  expect(footerElement).toBeInTheDocument();
});

test("renders home component with token refreshing feature", async () => {
  window.sessionStorage.setItem("accessToken", "accessToken");
  window.sessionStorage.setItem("refreshToken", "refreshToken");
  window.sessionStorage.setItem("tokenExpirationDate", new Date("Wed Jun 07 2022 22:42:25").toString());

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          refresh_token: "newRefreshToken",
          access_token: "newAccessToken",
        }),
    }),
  ) as Mock;

  render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>,
  );

  await new Promise(process.nextTick);

  expect(window.sessionStorage.getItem("accessToken")).toEqual("newAccessToken");
  expect(window.sessionStorage.getItem("refreshToken")).toEqual("newRefreshToken");
});

test("renders home component able to find segments in activities", async () => {
  window.sessionStorage.setItem("accessToken", "accessToken");
  window.sessionStorage.setItem("refreshToken", "refreshToken");
  window.sessionStorage.setItem("tokenExpirationDate", Date().toString());

  render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>,
  );

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          activity: {
            matchingSegmentsIds: ["12345"],
            segmentsPictures: ["ipfs://cid"],
          },
        }),
    }),
  ) as Mock;

  const modalElement = screen.queryByText("Segments in");
  expect(modalElement).not.toBeInTheDocument();

  const activity1Element = await screen.findByText(activity1.name);
  expect(activity1Element).toBeInTheDocument();

  const activity2Element = await screen.findByText(activity2.name);
  expect(activity2Element).toBeInTheDocument();

  const buttonElements = screen.queryAllByText("Check for eligible segments");
  expect(buttonElements).toHaveLength(activities.length);
});
