import React from "react";
import { expect, test } from "vitest";
import Footer from "./Footer";
import { render, screen } from "@testing-library/react";

test("renders footer", () => {
  render(<Footer />);
  const footerElement = screen.getByRole("contentinfo");
  expect(footerElement).toBeInTheDocument();
});
