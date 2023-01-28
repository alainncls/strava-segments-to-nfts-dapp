import { Button, Modal } from 'react-bootstrap';
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
      console.log('useEffect');
      setCurrentSegments(activity.segments);
    }
  }, [activity]);

  console.log('activity', activity);

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
        {currentSegments?.map((segment) => (
          <div key={segment.id}>
            <h5>{segment.title}</h5>
            <span>{segment.distance}</span>
            {!segment.picture && (
              <Button size={'sm'} onClick={() => generatePicture(segment)}>
                Generate picture
              </Button>
            )}
            {segment.picture && (
              <img
                alt={`Segment ${segment.id}`}
                src={segment.picture}
                width={500}
              />
            )}
          </div>
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
