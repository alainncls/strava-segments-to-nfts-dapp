import React from 'react';
import { Activity } from '../../types';
import ActivityItem from './ActivityItem';

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
        <ActivityItem
          activity={activity}
          checkForSegments={checkForSegments}
          displaySegments={displaySegments}
        />
      ))}
    </div>
  );
};

export default Activities;
