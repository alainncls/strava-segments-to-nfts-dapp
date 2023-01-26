export interface Activity {
  id: string;
  stravaId: number;
  name: string;
  segmentsIds: number[];
  matchingSegmentsIds: number[];
  segmentsPictures: string[];
  transactionsHashes: string[];
  start_date: string;
  segments?: Segment[];
}

export interface Segment {
  id: number;
}
