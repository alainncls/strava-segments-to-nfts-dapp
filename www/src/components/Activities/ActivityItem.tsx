import React, { useMemo, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Activity, Metadata } from '../../types';
import { createPicture } from '../../utils/segmentUtils';
import { uploadToIPFS } from '../../utils/ipfsUtils';
import StravaSegment from '../../config/StravaSegment.json';
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';

interface IProps {
  activity: Activity;
  checkForSegments: (activityId: string) => void;
  displaySegments: (activityId: string) => void;
}

const ActivityItem = (props: IProps) => {
  const { activity, checkForSegments, displaySegments } = props;

  console.log('activity', activity);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const [error, setError] = useState<string>();
  const [loadingStep, setLoadingStep] = useState<string>();

  const chainId = useMemo(() => {
    return chain ? `${chain.id.toString()}` : lineaTestnet.id.toString();
  }, [chain]);

  const contractAddress = useMemo(() => {
    if (!chainId) {
      return '0x0000000000000000000000000000000000000000';
    }

    const network = Object.entries(StravaSegment.networks).find(
      (net) => net[0] === chainId
    );

    return network
      ? (network[1].address as `0x${string}`)
      : '0x0000000000000000000000000000000000000000';
  }, [chainId]);

  const generatePicture = async () => {
    activity.picture = await createPicture(
      activity.name,
      activity.distance,
      activity.type,
      activity.polyline
    );
  };

  const convertToBlob = async (content: string) =>
    fetch(content).then((res) => res.blob());

  const uploadPictureToIpfs = async (picture?: string) => {
    if (picture) {
      return await uploadToIPFS(await convertToBlob(picture));
    }
  };

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: StravaSegment.abi,
    functionName: 'safeMint',
    args: [address, activity.metadata],
    enabled: Boolean(isConnected && address && activity.metadata),
  });
  const { data, write } = useContractWrite(config);

  const generateMetadata = (pictureIpfs: string): Metadata => {
    return {
      name: activity.name,
      image: pictureIpfs,
      attributes: [
        {
          trait_type: 'Distance',
          value: activity.distance,
        },
        {
          trait_type: 'Strava ID',
          value: activity.id,
        },
        {
          trait_type: 'Name',
          value: activity.name,
        },
        {
          trait_type: 'Type',
          value: activity.type,
        },
      ],
    };
  };

  const uploadMetadataToIpfs = async (metadata: Metadata): Promise<void> => {
    activity.metadata = await uploadToIPFS(JSON.stringify(metadata));
  };

  const prepareMinting = async () => {
    if (error) {
      setError(undefined);
    }

    setLoadingStep('Generate picture');
    await generatePicture();

    setLoadingStep('Upload picture to IPFS');
    const pictureIpfs = await uploadPictureToIpfs(activity.picture);

    if (pictureIpfs) {
      setLoadingStep('Generate metadata');
      const metadata = generateMetadata(pictureIpfs);

      setLoadingStep('Upload metadata to IPFS');
      await uploadMetadataToIpfs(metadata);
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

  return (
    <div className="col-sm-6 mb-3" key={activity.id}>
      <Card>
        <Card.Header>
          <Card.Title className={'mb-0'}>
            {activity.name}{' '}
            <a
              href={`https://www.strava.com/activities/${activity.id}`}
              target="_blank"
              rel="noreferrer"
              className={'text-decoration-none fs-6'}
            >
              (View on Strava)
            </a>
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div>
            {new Date(Date.parse(activity.start_date)).toLocaleDateString()}
          </div>
        </Card.Body>
        <Card.Footer className={'d-flex'}>
          <div>
            {!activity.segments ? (
              <Button
                className="btn btn-primary btn-sm"
                onClick={() => checkForSegments(activity.id)}
              >
                Check for eligible segments
              </Button>
            ) : (
              <Button
                className="btn btn-primary btn-sm"
                onClick={() => displaySegments(activity.id)}
                disabled={!activity.segments?.length}
              >
                {`${activity.segments.length} segments`}
              </Button>
            )}
            {activity.metadata ? (
              <Button
                className="btn btn-primary btn-sm"
                onClick={() => mintNft()}
                disabled={!isConnected}
              >
                {isConnected ? 'Mint as an NFT' : 'Connect your wallet'}
              </Button>
            ) : (
              <Button
                className="btn btn-primary btn-sm"
                size={'sm'}
                onClick={() => prepareMinting()}
              >
                Prepare NFT for minting
              </Button>
            )}
          </div>
          <div>
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
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default ActivityItem;
