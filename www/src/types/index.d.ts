export interface Segment {
  id: number;
  title: string;
  distance: number;
  type: string;
  polyline?: number[][];
  picture?: string;
  metadata?: string;
}

export interface Activity {
  id: string;
  name: string;
  start_date: string;
  distance: number | string;
  type: string;
  polyline?: number[][];
  map?: { summary_polyline?: string };
  segments?: Segment[];
  picture?: string;
  metadata?: string;
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

export interface Attribute {
  trait_type: string;
  value: string | number;
}

export interface Metadata {
  name: string;
  image: string;
  attributes: Attribute[];
}

interface Config {
  chainId: string;
  abi: any;
  address: `0x${string}`;
}

interface NetworkConfig {
  networks: Config[];
}
