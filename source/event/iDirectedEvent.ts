import { Operation } from './operation';

export interface IDirectedEvent {
  operation?: Operation;
  name?: string;
  selection?: unknown;
  single?: boolean;
  //  deepcode ignore no-any: any needed
  content?: unknown | unknown[];
  timestamp?: string;
  id?: unknown;
  options?: unknown;
}
