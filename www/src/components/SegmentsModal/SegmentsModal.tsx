import { Button, Container, Modal } from 'react-bootstrap';
import React, { useEffect, useMemo, useState } from 'react';
import { generatePictureFromSegment } from '../../utils/segmentUtils';
import {
  Activity,
  Config,
  Metadata,
  NetworkConfig,
  RawSegment,
  Segment,
} from '../../types';
import * as PolylineUtil from 'polyline-encoded';
import { uploadToIPFS } from '../../utils/ipfsUtils';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import SegmentItem from './SegmentItem';
import _StravaSegment from '../../config/StravaSegment.json';
import { lineaTestnet } from 'wagmi/chains';

const StravaSegment = _StravaSegment as NetworkConfig;

interface IProps {
  displayModal: boolean;
  activity?: Activity;
  onHide: () => void;
  accessToken?: string;
}

const SegmentsModal = (props: IProps) => {
  const { displayModal, activity, onHide, accessToken } = props;

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [currentSegments, setCurrentSegments] = useState(activity?.segments);
  const [loadingStep, setLoadingStep] = useState<string>();
  const [error, setError] = useState<string>();
  const [segmentToMint, setSegmentToMint] = useState<Segment>();

  const chainId = useMemo(() => {
    return chain ? `${chain.id.toString()}` : lineaTestnet.id.toString();
  }, [chain]);

  const networkConfig: Config | undefined = useMemo(() => {
    return StravaSegment.networks.find(
      (network) => network.chainId === chainId
    );
  }, [chainId]);

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
            currentSegment.polyline = PolylineUtil.decode(
              (await getSegment(currentSegment.id)).map.polyline
            );
            currentSegment.picture =
              await generatePictureFromSegment(currentSegment);
          }
          return currentSegment;
        })
      );
      setCurrentSegments(updatedSegments);
    }
  };

  const convertToBlob = async (content: string) =>
    fetch(content).then((res) => res.blob());

  const uploadPictureToIpfs = async (segment: Segment) => {
    if (segment.picture) {
      return await uploadToIPFS(await convertToBlob(segment.picture));
    }
  };

  const generateMetadata = (
    segment: Segment,
    pictureIpfs: string
  ): Metadata => {
    return {
      name: segment.title,
      image: pictureIpfs,
      attributes: [
        {
          trait_type: 'Distance',
          value: segment.distance,
        },
        {
          trait_type: 'Strava ID',
          value: segment.id,
        },
        {
          trait_type: 'Name',
          value: segment.title,
        },
        {
          trait_type: 'Type',
          value: segment.type,
        },
      ],
    };
  };

  const uploadMetadataToIpfs = async (
    metadata: Metadata,
    segment: Segment
  ): Promise<void> => {
    const metadataIpfs = await uploadToIPFS(JSON.stringify(metadata));

    const matchingSegment = currentSegments?.find(
      (seg) => seg.id === segment.id
    );

    if (matchingSegment) {
      matchingSegment.metadata = metadataIpfs;
      setSegmentToMint(matchingSegment);

      setCurrentSegments(
        currentSegments?.map((seg) => {
          if (seg.id === segment.id) {
            seg = matchingSegment;
          }
          return seg;
        })
      );
    }
  };

  const { config } = usePrepareContractWrite({
    address: networkConfig?.address,
    abi: networkConfig?.abi,
    functionName: 'safeMint',
    args: [address, segmentToMint?.metadata],
    enabled: Boolean(isConnected && address && segmentToMint?.metadata),
  });
  const { data, write } = useContractWrite(config);

  const prepareMinting = async (segment: Segment) => {
    if (error) {
      setError(undefined);
    }

    setLoadingStep('Generate picture');
    await generatePicture(segment);

    setLoadingStep('Upload picture to IPFS');
    const pictureIpfs = await uploadPictureToIpfs(segment);

    if (pictureIpfs) {
      setLoadingStep('Generate metadata');
      const metadata = generateMetadata(segment, pictureIpfs);

      setLoadingStep('Upload metadata to IPFS');
      await uploadMetadataToIpfs(metadata, segment);
    } else {
      setLoadingStep(undefined);
      setError('Error while uploading picture to IPFS');
    }
  };

  const mintNft = async () => {
    if (write) {
      write();
      setLoadingStep(undefined);
    }
  };

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  const getSegment = async (segmentId: number): Promise<RawSegment> => {
    return await fetch(
      `https://www.strava.com/api/v3/segments/${segmentId}?access_token=${accessToken}`
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((e) => console.error(e));
  };

  return (
    <Modal show={displayModal} onHide={onHide} size={'lg'} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>{`Segments in ${activity?.name}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentSegments?.map((segment, index) => (
          <>
            <Container key={`${segment.id + index}`}>
              <SegmentItem
                segment={segment}
                prepareMinting={prepareMinting}
                mintNft={mintNft}
              />
            </Container>
          </>
        ))}
      </Modal.Body>
      <Modal.Footer>
        {loadingStep && <p>{loadingStep}</p>}
        {isTransactionLoading && (
          <>
            <i className="bi bi-cloud-upload text-warning" />
            <p>Transaction in progress...</p>
          </>
        )}
        {isTransactionSuccess && (
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
