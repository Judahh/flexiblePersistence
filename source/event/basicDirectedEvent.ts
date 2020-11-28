import { Operation } from './operation';

export interface BasicDirectedEvent {
  operation?: Operation;
  name?: string;
  selection?: unknown;
  single?: boolean;
  //  deepcode ignore no-any: any needed
  content?: any | any[];
  timestamp?: string;
  _id?: unknown;
  __v?: unknown;
}
