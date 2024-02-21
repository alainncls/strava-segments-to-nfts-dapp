import React from "react";
import { Button, Card } from "react-bootstrap";
import { Activity } from "../../types";

interface IProps {
  activities: Activity[];
  checkForSegments: (activityId: string) => void;
  displaySegments: (activityId: string) => void;
}

const Activities = (props: IProps) => {
  const { activities, checkForSegments, displaySegments } = props;

  return (
    <div className="row">
      {activities?.map((activity) => (
        <div className="col-sm-6 mb-3" key={activity.id}>
          <Card>
            <Card.Header>
              <Card.Title className={"mb-0"}>
                {activity.name}{" "}
                <a
                  href={`https://www.strava.com/activities/${activity.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className={"text-decoration-none fs-6"}
                >
                  (View on Strava)
                </a>
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div>{new Date(Date.parse(activity.start_date)).toLocaleDateString()}</div>
            </Card.Body>
            <Card.Footer className={"d-flex"}>
              <div>
                {!activity.segments && (
                  <Button className="btn btn-primary btn-sm" onClick={() => checkForSegments(activity.id)}>
                    Check for eligible segments
                  </Button>
                )}
                {activity.segments && (
                  <Button
                    className="btn btn-primary btn-sm"
                    onClick={() => displaySegments(activity.id)}
                    disabled={!activity.segments?.length}
                  >
                    {`${activity.segments.length} segments`}
                  </Button>
                )}
              </div>
            </Card.Footer>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Activities;
