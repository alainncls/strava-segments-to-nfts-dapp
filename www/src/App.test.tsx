import { expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import Home from "./screens/Home/Home";
import { render, screen } from "@testing-library/react";

test("renders app", () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/" }]}>
      <Home />
    </MemoryRouter>,
  );
  const headerElement = screen.getByRole("banner");
  expect(headerElement).toBeInTheDocument();

  const footerElement = screen.getByRole("contentinfo");
  expect(footerElement).toBeInTheDocument();
});
