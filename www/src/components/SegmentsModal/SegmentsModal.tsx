import { Button, Container, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { generatePictureFromSegment } from '../../utils/segmentUtils';
import { Activity, Metadata, RawSegment, Segment } from '../../types';
import * as PolylineUtil from 'polyline-encoded';
import { uploadToIPFS } from '../../utils/ipfsUtils';
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import SegmentItem from './SegmentItem';

interface IProps {
  displayModal: boolean;
  activity?: Activity;
  onHide: () => void;
  accessToken?: string;
}

const SegmentsModal = (props: IProps) => {
  const { displayModal, activity, onHide, accessToken } = props;

  const { address, isConnected } = useAccount();

  const [currentSegments, setCurrentSegments] = useState(activity?.segments);
  const [loadingStep, setLoadingStep] = useState<string>();
  const [error, setError] = useState<string>();
  const [segmentToMint, setSegmentToMint] = useState<Segment>();

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
            currentSegment.picture = await generatePictureFromSegment(
              currentSegment
            );
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
      const pictureForm = new FormData();
      pictureForm.append(
        'file',
        await convertToBlob(segment.picture),
        `strava-nfts.png`
      );

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
      ],
    };
  };

  const uploadMetadataToIpfs = async (
    metadata: Metadata,
    segmentId: number
  ) => {
    const metadataForm = new FormData();
    metadataForm.append(
      'file',
      await convertToBlob(JSON.stringify(metadata)),
      `strava-nfts.json`
    );

    const metadataIpfs = await uploadToIPFS(JSON.stringify(metadata));

    if (metadataIpfs && currentSegments) {
      setCurrentSegments(
        currentSegments.map((seg) => {
          if (seg.id === segmentId) {
            seg.metadata = metadataIpfs;
            setSegmentToMint(seg);
          }
          return seg;
        })
      );
    }
  };

  const { config } = usePrepareContractWrite({
    address: '0xe3D43b1fcb5a09c295ecFd69321eFbAbBFE091d0',
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
        ],
        name: 'safeMint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'safeMint',
    args: [address || '0x1234', segmentToMint?.metadata || ''],
    enabled: Boolean(isConnected && segmentToMint?.metadata),
  });
  const { data, write } = useContractWrite(config);

  const mintNft = async (segment: Segment) => {
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
      await uploadMetadataToIpfs(metadata, segment.id);

      if (segmentToMint) {
        if (write) {
          write();
          setLoadingStep(undefined);
        }
      } else {
        setLoadingStep(undefined);
        setError('Error while uploading metadata to IPFS');
      }
    } else {
      setLoadingStep(undefined);
      setError('Error while uploading picture to IPFS');
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
              <SegmentItem segment={segment} mintNft={mintNft} />
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
