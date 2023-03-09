import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Activity } from '../../types/activity';
import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';
import Activities from '../../components/Activities/Activities';
import SegmentsModal from '../../components/SegmentsModal/SegmentsModal';
import Footer from '../../components/Footer/Footer';
import { computeDistance, isKnownType } from '../../utils/segmentUtils';
import { Segment, SegmentEffort } from '../../types/segment';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshToken, setRefreshToken] = useState<string>();
  const [accessToken, setAccessToken] = useState<string>();
  const [tokenCreationDate, setTokenCreationDate] = useState<Date>();
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (refreshToken && !isTokenValid()) {
      const clientID = process.env.REACT_APP_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
      fetch(
        `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        {
          method: 'POST',
        }
      )
        .then((res) => res.json())
        .then((result) => {
          sessionStorage.setItem('refreshToken', result.refresh_token);
          sessionStorage.setItem('accessToken', result.access_token);
          sessionStorage.setItem('tokenCreationDate', Date().toString());
          setRefreshToken(result.refresh_token);
          setAccessToken(result.access_token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [refreshToken, tokenCreationDate]);

  useEffect(() => {
    const access = sessionStorage.getItem('accessToken');
    if (access && access !== 'undefined') {
      setAccessToken(access);
    }

    const refresh = sessionStorage.getItem('refreshToken');
    if (refresh && refresh !== 'undefined') {
      setRefreshToken(refresh);
    }

    const creationDate = sessionStorage.getItem('tokenCreationDate');
    if (creationDate) {
      setTokenCreationDate(new Date(creationDate));
    }
  }, []);

  // use current access token to call all activities
  useEffect(() => {
    if (accessToken && isTokenValid()) {
      setIsLoading(true);
      fetch(
        `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}`
      )
        .then((res) => res.json())
        .then((data) => {
          setActivities(data);
        })
        .catch((e) => console.error(e))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [accessToken, tokenCreationDate]);

  const isTokenValid = () => {
    return (
      tokenCreationDate &&
      tokenCreationDate.getTime() > new Date().getTime() - 6 * 3600 * 1000
    );
  };

  const checkForSegments = async (activityId: string) => {
    if (accessToken && isTokenValid()) {
      setIsLoading(true);

      let segments: Segment[] = [];

      fetch(
        `https://www.strava.com/api/v3/activities/${activityId}?access_token=${accessToken}`
      )
        .then((res) => res.json())
        .then(async (data) => {
          const segmentEfforts = data.segment_efforts;
          if (segmentEfforts?.length) {
            segments = await Promise.all(
              segmentEfforts.map(async (segmentEffort: SegmentEffort) => {
                return {
                  id: segmentEffort.segment.id,
                  title: segmentEffort.segment.name,
                  distance: computeDistance(segmentEffort.segment.distance),
                  type: isKnownType(segmentEffort.segment.activity_type)
                    ? segmentEffort.segment.activity_type
                    : 'default',
                };
              })
            );
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          setActivities(
            activities.map((activity) => {
              if (activity.id === activityId) {
                activity.segments = segments;
              }
              return activity;
            })
          );
          setIsLoading(false);
        });
    }
  };

  const displaySegments = (activityId: string) => {
    setCurrentActivity(
      activities.find((activity) => activity.id === activityId)
    );
    setShowModal(true);
  };

  const onModalHide = () => {
    setShowModal(false);
    setCurrentActivity(undefined);
  };

  return (
    <>
      <Loader loading={isLoading} />
      <Container className="p-3">
        <Header isStravaConnected={!!accessToken} />
        <div className={'mb-5'}>
          {!!(accessToken && activities.length) && (
            <>
              <Activities
                activities={activities}
                checkForSegments={checkForSegments}
                displaySegments={displaySegments}
              />
              <SegmentsModal
                activity={currentActivity}
                displayModal={showModal}
                onHide={onModalHide}
                accessToken={accessToken}
              />
            </>
          )}
        </div>
        <Footer />
      </Container>
    </>
  );
};

export default Home;
