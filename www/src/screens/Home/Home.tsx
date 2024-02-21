import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Loader from "../../components/Loader/Loader";
import Header from "../../components/Header/Header";
import Activities from "../../components/Activities/Activities";
import SegmentsModal from "../../components/SegmentsModal/SegmentsModal";
import Footer from "../../components/Footer/Footer";
import { computeDistance, isKnownType } from "../../utils/segmentUtils";
import { Activity, Segment, SegmentEffort } from "../../types";

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
      fetch(`https://strava.alainnicolas.fr/.netlify/functions/api?token=${refreshToken}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((result) => {
          sessionStorage.setItem("refreshToken", result.token.refresh_token);
          sessionStorage.setItem("accessToken", result.token.access_token);
          sessionStorage.setItem("tokenCreationDate", Date().toString());
          setRefreshToken(result.refresh_token);
          setAccessToken(result.access_token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [refreshToken, tokenCreationDate]);

  useEffect(() => {
    const access = sessionStorage.getItem("accessToken");
    if (access && access !== "undefined") {
      setAccessToken(access);
    }

    const refresh = sessionStorage.getItem("refreshToken");
    if (refresh && refresh !== "undefined") {
      setRefreshToken(refresh);
    }

    const creationDate = sessionStorage.getItem("tokenCreationDate");
    if (creationDate) {
      setTokenCreationDate(new Date(creationDate));
    }
  }, []);

  // use current access token to call all activities
  useEffect(() => {
    if (accessToken && isTokenValid()) {
      setIsLoading(true);
      fetch(`https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}`)
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
    return tokenCreationDate && tokenCreationDate.getTime() > new Date().getTime() - 6 * 3600 * 1000;
  };

  const checkForSegments = async (activityId: string) => {
    if (accessToken && isTokenValid()) {
      setIsLoading(true);

      let segments: Segment[] = [];

      fetch(`https://www.strava.com/api/v3/activities/${activityId}?access_token=${accessToken}`)
        .then((res) => res.json())
        .then(async (data) => {
          const segmentEfforts = data.segment_efforts;
          if (segmentEfforts?.length) {
            const rawSegments = await Promise.all(
              segmentEfforts.map(async (segmentEffort: SegmentEffort) => {
                return {
                  id: segmentEffort.segment.id,
                  title: segmentEffort.segment.name,
                  distance: computeDistance(segmentEffort.segment.distance),
                  type: isKnownType(segmentEffort.segment.activity_type)
                    ? segmentEffort.segment.activity_type
                    : "default",
                };
              }),
            );
            segments = rawSegments.filter((currentSegment, index, self) => {
              return self.findIndex((segment) => segment.id === currentSegment.id) === index;
            });
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
            }),
          );
          setIsLoading(false);
        });
    }
  };

  const displaySegments = (activityId: string) => {
    setCurrentActivity(activities.find((activity) => activity.id === activityId));
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
        <div className={"mb-5"}>
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
