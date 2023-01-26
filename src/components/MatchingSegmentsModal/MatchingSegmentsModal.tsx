import { Button, Modal } from 'react-bootstrap';
import React from 'react';
import { ISegment } from '../../types/segment';

interface IProps {
  displayModal: boolean;
  checkResults: ISegment[];
  handleMintNfts: () => void;
  onHide: () => void;
}

const MatchingSegmentsModal = (props: IProps) => {
  const { displayModal, checkResults, handleMintNfts, onHide } = props;

  return (
    <Modal show={displayModal} onHide={onHide} size={'lg'} scrollable={true}>
      <Modal.Header closeButton>
        <Modal.Title>Eligible segments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {checkResults.map((result) => (
          <div key={result.segmentId}>
            <h5>Segment #{result.segmentId}</h5>
            <img
              alt={`Segment ${result.segmentId}`}
              src={`${result.picture.replace(
                'ipfs://',
                'https://ipfs.io/ipfs/'
              )}`}
              width={500}
            />
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleMintNfts}>
          Mint NFTs
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default MatchingSegmentsModal;
