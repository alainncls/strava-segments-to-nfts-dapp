export interface Segment {
  id: number;
  title: string;
  distance: number;
  type: string;
  polyline: number[][];
  picture: string;
}

export interface RawSegment extends Segment {
  activity_type: string;
  name: string;
  map: SegmentMap;
}

export interface SegmentMap {
  polyline: string[];
}

export interface SegmentEffort {
  segment: RawSegment;
}
