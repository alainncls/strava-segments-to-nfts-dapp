import { Button, Col, Row } from 'react-bootstrap';
import React from 'react';
import { Segment } from '../../types';
import { useAccount } from 'wagmi';

interface IProps {
  segment: Segment;
  mintNft: (segment: Segment) => Promise<void>;
}

const SegmentItem = (props: IProps) => {
  const { segment, mintNft } = props;

  const { isConnected } = useAccount();

  return (
    <Row>
      <Col>
        <h5 className={'mb-0'}>{`${segment.title} - ${segment.distance}`}</h5>
        <a
          href={`https://www.strava.com/segments/${segment.id}`}
          target={'_blank'}
          rel="noreferrer"
          className={'text-decoration-none'}
        >
          (View on Strava)
        </a>
        {segment.metadata && (
          <a
            href={segment.metadata}
            target={'_blank'}
            rel="noreferrer"
            className={'text-decoration-none'}
          >
            (View metadata on IPFS)
          </a>
        )}
      </Col>

      <Col>
        <>
          <Button
            size={'sm'}
            onClick={() => mintNft(segment)}
            disabled={!isConnected}
          >
            {isConnected ? 'Mint as an NFT' : 'Connect your wallet'}
          </Button>
        </>
      </Col>
      {segment.picture && (
        <img
          alt={`Segment ${segment.id}`}
          src={segment.picture}
          width={500}
          className={'my-2'}
        />
      )}
    </Row>
  );
};
export default SegmentItem;
