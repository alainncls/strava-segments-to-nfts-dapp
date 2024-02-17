import { expect, test, vi } from "vitest";
import Header from "./Header";
import React from "react";
import { render, screen } from "@testing-library/react";

const connectKitTestId = "connect-kit-button";

vi.mock("connectkit", () => ({
  ConnectKitButton: () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require("react");
    return React.createElement("MockButton", {
      "data-testid": connectKitTestId,
    });
  },
}));

test("renders header", () => {
  render(<Header />);
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByText("Segments to NFTs")).toBeInTheDocument();
  expect(screen.getAllByRole("link")).toHaveLength(3);
  expect(screen.queryByTestId(connectKitTestId)).toBeInTheDocument();
});
