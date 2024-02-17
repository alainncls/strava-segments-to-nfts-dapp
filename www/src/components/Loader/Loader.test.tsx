import React from "react";
import { expect, test } from "vitest";
import Loader from "./Loader";
import { render, screen } from "@testing-library/react";

test("renders loading spinner", () => {
  render(<Loader loading={true} />);
  const spinnerElement = screen.getByRole("status");
  expect(spinnerElement).toBeInTheDocument();
});

test("renders no loading spinner", () => {
  render(<Loader loading={false} />);
  const spinnerElement = screen.queryByRole("status");
  expect(spinnerElement).not.toBeInTheDocument();
});
