import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Activity } from '../../types/activity';
import { generatePictureFromSegment } from '../../utils/segmentUtils';
import { RawSegment, Segment } from '../../types/segment';
import * as PolylineUtil from 'polyline-encoded';

interface IProps {
  displayModal: boolean;
  activity?: Activity;
  onHide: () => void;
  accessToken?: string;
}

const MatchingSegmentsModal = (props: IProps) => {
  const { displayModal, activity, onHide, accessToken } = props;
  const [currentSegments, setCurrentSegments] = useState(activity?.segments);

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

  const uploadToIpfs = async (segment: Segment) => {
    if (segment.picture) {
      const form = new FormData();
      form.append(
        'file',
        await convertToBlob(segment.picture),
        `${segment.title}.png`
      );

      const result = await fetch(
        `https://ipfs.infura.io:5001/api/v0/add?pin=false`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              process.env.REACT_APP_INFURA_IPFS_ID +
                ':' +
                process.env.REACT_APP_INFURA_IPFS_SECRET
            ).toString('base64')}`,
          },
          body: form,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          return data;
        })
        .catch((e) => console.error(e));
      if (currentSegments) {
        setCurrentSegments(
          currentSegments.map((seg) => {
            if (seg.id === segment.id) {
              seg.pictureLink = `https://ipfs.io/ipfs/${result.Hash}`;
            }
            return seg;
          })
        );
      }
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
                  <h5>{`${segment.title} - ${segment.distance}`}</h5>
                </Col>

                {!segment.picture && (
                  <Col>
                    <Button
                      size={'sm'}
                      onClick={() => generatePicture(segment)}
                    >
                      Generate picture
                    </Button>
                  </Col>
                )}
                {segment.picture && (
                  <Col>
                    {!segment.pictureLink && (
                      <Button size={'sm'} onClick={() => uploadToIpfs(segment)}>
                        Upload to IPFS
                      </Button>
                    )}
                    {segment.pictureLink && (
                      <a
                        href={segment.pictureLink}
                        target={'_blank'}
                        rel="noreferrer"
                      >
                        Link to IPFS
                      </a>
                    )}
                  </Col>
                )}
              </Row>
            </Container>
            {segment.picture && (
              <img
                alt={`Segment ${segment.id}`}
                src={segment.picture}
                width={500}
              />
            )}
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
export default MatchingSegmentsModal;
