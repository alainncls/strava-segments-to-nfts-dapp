import { Button, Col, Container, Modal, Row, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Activity } from '../../types/activity';
import { generatePictureFromSegment } from '../../utils/segmentUtils';
import { RawSegment, Segment } from '../../types/segment';
import * as PolylineUtil from 'polyline-encoded';
import { uploadToIPFS } from '../../utils/ipfsUtils';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';

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
  const [isLoading, setIsLoading] = useState<Segment>();
  const [segmentToMint, setSegmentToMint] = useState<Segment>();

  useEffect(() => {
    if (activity?.segments) {
      setCurrentSegments(activity.segments);
    }
  }, [activity]);

  const generatePicture = async (segment: Segment) => {
    if (currentSegments) {
      setIsLoading(segment);
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
      setIsLoading(undefined);
    }
  };

  const convertToBlob = async (content: string) =>
    fetch(content).then((res) => res.blob());

  const uploadToIpfs = async (segment: Segment) => {
    if (segment.picture) {
      setIsLoading(segment);
      const pictureForm = new FormData();
      pictureForm.append(
        'file',
        await convertToBlob(segment.picture),
        `strava-nfts.png`
      );

      const pictureIpfs = await uploadToIPFS(
        await convertToBlob(segment.picture)
      );

      if (pictureIpfs) {
        const metadata = {
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
              if (seg.id === segment.id) {
                seg.metadata = metadataIpfs;
                setSegmentToMint(seg);
              }
              return seg;
            })
          );
        }
      }
      setIsLoading(undefined);
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
    enabled: Boolean(segmentToMint?.metadata && isConnected),
  });
  const { write } = useContractWrite(config);

  const mintNft = async () => {
    if (segmentToMint && write) {
      write();
    }
  };

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
              <Row>
                <Col>
                  <h5
                    className={'mb-0'}
                  >{`${segment.title} - ${segment.distance}`}</h5>
                  <a
                    href={`https://www.strava.com/segments/${segment.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className={'text-decoration-none'}
                  >
                    (View on Strava)
                  </a>
                </Col>

                {!segment.picture && (
                  <Col>
                    <Button
                      size={'sm'}
                      onClick={() => generatePicture(segment)}
                    >
                      {isLoading === segment && (
                        <>
                          <Spinner
                            as="span"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />{' '}
                        </>
                      )}
                      Generate picture
                    </Button>
                  </Col>
                )}
                {segment.picture && (
                  <Col>
                    {!segment.metadata && (
                      <Button size={'sm'} onClick={() => uploadToIpfs(segment)}>
                        {isLoading === segment && (
                          <>
                            <Spinner
                              as="span"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />{' '}
                          </>
                        )}
                        Upload to IPFS
                      </Button>
                    )}
                    {segment.metadata && (
                      <>
                        <a
                          href={segment.metadata}
                          target={'_blank'}
                          rel="noreferrer"
                          className={'me-2'}
                        >
                          Metadata on IPFS
                        </a>
                        <Button
                          size={'sm'}
                          onClick={() => mintNft()}
                          disabled={!(segmentToMint || write)}
                        >
                          {isLoading === segment && (
                            <>
                              <Spinner
                                as="span"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />{' '}
                            </>
                          )}
                          Mint as an NFT
                        </Button>
                      </>
                    )}
                  </Col>
                )}
                {segment.picture && (
                  <img
                    alt={`Segment ${segment.id}`}
                    src={segment.picture}
                    width={500}
                    className={'my-2'}
                  />
                )}
              </Row>
            </Container>
          </>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default SegmentsModal;
