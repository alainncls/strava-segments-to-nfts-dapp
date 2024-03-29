import { Button, Container, Modal } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import { generatePictureFromSegment } from "../../utils/segmentUtils";
import { Activity, Metadata, NetworkConfig, RawSegment, Segment } from "../../types";
import * as PolylineUtil from "polyline-encoded";
import { uploadToIPFS } from "../../utils/ipfsUtils";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import SegmentItem from "./SegmentItem";
import _StravaSegment from "../../config/StravaSegment.json";
import { defaultConfig } from "../../config/defaultConfig";

const StravaSegment = _StravaSegment as NetworkConfig;

interface IProps {
  displayModal: boolean;
  activity?: Activity;
  onHide: () => void;
  accessToken?: string;
}

const SegmentsModal = (props: IProps) => {
  const { displayModal, activity, onHide, accessToken } = props;

  const { address, chainId } = useAccount();

  const [currentSegments, setCurrentSegments] = useState(activity?.segments);
  const [loadingStep, setLoadingStep] = useState<string>();
  const [error, setError] = useState<string>();
  const [segmentToMint, setSegmentToMint] = useState<Segment>();

  const networkConfig = useMemo(() => {
    return StravaSegment.networks.find((network) => network.chainId === chainId?.toString()) ?? defaultConfig;
  }, [chainId]);

  const { data: hash, isPending, writeContract } = useWriteContract();

  useEffect(() => {
    if (activity?.segments) {
      setCurrentSegments(activity.segments);
    }
  }, [activity]);

  const generatePicture = async (segment: Segment) => {
    if (currentSegments) {
      const updatedSegments = await Promise.all(
        currentSegments.map(async (currentSegment) => {
          if (currentSegment.id === segment.id) {
            currentSegment.polyline = PolylineUtil.decode((await getSegment(currentSegment.id)).map.polyline);
            currentSegment.picture = await generatePictureFromSegment(currentSegment);
          }
          return currentSegment;
        }),
      );
      setCurrentSegments(updatedSegments);
    }
  };

  const convertToBlob = async (content: string) => {
    return new Blob([content], { type: "application/json" });
  };

  const uploadPictureToIpfs = async (segment: Segment) => {
    if (segment.picture) {
      return await uploadToIPFS(await convertToBlob(segment.picture));
    }
  };

  const generateMetadata = (segment: Segment, pictureIpfs: string): Metadata => {
    return {
      name: segment.title,
      image: pictureIpfs,
      attributes: [
        {
          trait_type: "Distance",
          value: segment.distance,
        },
        {
          trait_type: "Strava ID",
          value: segment.id,
        },
        {
          trait_type: "Name",
          value: segment.title,
        },
        {
          trait_type: "Type",
          value: segment.type,
        },
      ],
    };
  };

  const uploadMetadataToIpfs = async (metadata: Metadata, segment: Segment): Promise<void> => {
    const metadataIpfs = await uploadToIPFS(await convertToBlob(JSON.stringify(metadata)));

    const matchingSegment = currentSegments?.find((seg) => seg.id === segment.id);

    if (matchingSegment) {
      matchingSegment.metadata = metadataIpfs;
      setSegmentToMint(matchingSegment);

      setCurrentSegments(
        currentSegments?.map((seg) => {
          if (seg.id === segment.id) {
            seg = matchingSegment;
          }
          return seg;
        }),
      );
    }
  };

  const prepareMinting = async (segment: Segment) => {
    if (error) {
      setError(undefined);
    }

    setLoadingStep("Generate picture");
    await generatePicture(segment);

    setLoadingStep("Upload picture to IPFS");
    const pictureIpfs = await uploadPictureToIpfs(segment);

    if (pictureIpfs) {
      setLoadingStep("Generate metadata");
      const metadata = generateMetadata(segment, pictureIpfs);

      setLoadingStep("Upload metadata to IPFS");
      await uploadMetadataToIpfs(metadata, segment);
    } else {
      setLoadingStep(undefined);
      setError("Error while uploading picture to IPFS");
    }
  };

  const mintNft = async () => {
    writeContract({
      address: networkConfig.address,
      abi: networkConfig.abi,
      functionName: "safeMint",
      args: [address, segmentToMint?.metadata],
    });
    setLoadingStep(undefined);
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const getSegment = async (segmentId: number): Promise<RawSegment> => {
    return await fetch(`https://www.strava.com/api/v3/segments/${segmentId}?access_token=${accessToken}`)
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((e) => console.error(e));
  };

  return (
    <Modal show={displayModal} onHide={onHide} size={"lg"} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>{`Segments in ${activity?.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentSegments?.map((segment, index) => (
          <Container key={`${segment.id + index}`}>
            <SegmentItem segment={segment} prepareMinting={prepareMinting} mintNft={mintNft} />
          </Container>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {loadingStep && <p>{loadingStep}</p>}
        {(isPending || isConfirming) && (
          <>
            <i className="bi bi-cloud-upload text-warning" />
            <p>Transaction in progress...</p>
          </>
        )}
        {isConfirmed && (
          <>
            <i className="bi bi-check-circle text-success" />
            <p>Transaction successful</p>
          </>
        )}
        {error && (
          <>
            <i className="bi bi-exclamation-circle text-danger" />
            <p>{error}</p>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default SegmentsModal;
