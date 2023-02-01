import { Segment } from './segment';

export interface Activity {
  id: string;
  name: string;
  start_date: string;
  segments?: Segment[];
}
