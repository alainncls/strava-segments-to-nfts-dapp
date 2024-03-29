import React from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { Segment } from "../../types";
import SegmentItem from "./SegmentItem";
import { fireEvent, render, screen } from "@testing-library/react";

let prepareMinting: (segment: Segment) => Promise<void>;
let mintNft: () => Promise<void>;
const segment: Segment = {
  id: 123456,
  type: "Ride",
  title: "Cool segment",
  distance: 123,
  polyline: [[1, 1]],
  metadata: undefined,
  picture: undefined,
};

beforeEach(() => {
  prepareMinting = vi.fn();
  mintNft = vi.fn();
});

test("renders segment item without picture or metadata", () => {
  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);
  const titleElement = screen.getByText(`${segment.title} - ${segment.distance}`);
  expect(titleElement).toBeInTheDocument();

  const metadataElement = screen.queryByText("(View metadata on IPFS)");
  expect(metadataElement).not.toBeInTheDocument();

  const prepareButton = screen.getByText("Prepare NFT for minting");
  expect(prepareButton).toBeInTheDocument();

  const pictureElement = screen.queryByAltText(`Segment ${segment.id}`);
  expect(pictureElement).not.toBeInTheDocument();
});

test("renders segment item with ability to generate metadata", () => {
  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);
  const titleElement = screen.getByText(`${segment.title} - ${segment.distance}`);
  expect(titleElement).toBeInTheDocument();

  const metadataElement = screen.queryByText("(View metadata on IPFS)");
  expect(metadataElement).not.toBeInTheDocument();

  const prepareButton = screen.getByText("Prepare NFT for minting");
  expect(prepareButton).toBeInTheDocument();

  const pictureElement = screen.queryByAltText(`Segment ${segment.id}`);
  expect(pictureElement).not.toBeInTheDocument();

  fireEvent(
    prepareButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(prepareMinting).toHaveBeenCalledWith(segment);
});

test("renders segment item with picture but no metadata", () => {
  segment.picture = "png";

  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);
  const titleElement = screen.getByText(`${segment.title} - ${segment.distance}`);
  expect(titleElement).toBeInTheDocument();

  const metadataElement = screen.queryByText("(View metadata on IPFS)");
  expect(metadataElement).not.toBeInTheDocument();

  const prepareButton = screen.getByText("Prepare NFT for minting");
  expect(prepareButton).toBeInTheDocument();

  const pictureElement = screen.queryByAltText(`Segment ${segment.id}`);
  expect(pictureElement).toBeInTheDocument();
});

test("renders segment item with picture and metadata", () => {
  segment.picture = "png";
  segment.metadata = "metadata";

  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);
  const titleElement = screen.getByText(`${segment.title} - ${segment.distance}`);
  expect(titleElement).toBeInTheDocument();

  const metadataElement = screen.queryByText("(View metadata on IPFS)");
  expect(metadataElement).toBeInTheDocument();

  const mintButton = screen.queryByText("Connect your wallet");
  expect(mintButton).toBeInTheDocument();
  expect(mintButton).toBeDisabled();

  const pictureElement = screen.queryByAltText(`Segment ${segment.id}`);
  expect(pictureElement).toBeInTheDocument();
});

test("renders segment item without ability to mint it if not connected", () => {
  segment.picture = "png";
  segment.metadata = "metadata";

  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);

  const mintButton = screen.getByText("Connect your wallet");
  expect(mintButton).toBeInTheDocument();
  expect(mintButton).toBeDisabled();

  fireEvent(
    mintButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(mintNft).not.toHaveBeenCalled();
});

test.skip("renders segment item with ability to mint it if connected", async () => {
  segment.picture = "png";
  segment.metadata = "metadata";

  render(<SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />);

  const connectButton = screen.getByRole("button", {
    name: "Connect your wallet",
  });

  fireEvent(
    connectButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }),
  );

  const mintButton = screen.getByText("Mint as an NFT");
  expect(mintButton).toBeInTheDocument();
  expect(mintButton).not.toBeDisabled();

  fireEvent(
    mintButton,
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }),
  );
  expect(mintNft).toHaveBeenCalled();
});
