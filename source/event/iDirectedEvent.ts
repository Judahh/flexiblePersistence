import { IOptions } from './iOptions';
import { Operation } from './operation';

export interface IDirectedEvent {
  operation?: Operation;
  name?: string;
  selection?: unknown;
  single?: boolean;
  content?: unknown | unknown[];
  timestamp?: string;
  id?: unknown;
  options?: IOptions;
  correct?: boolean;
  replace?: boolean; // only for create/update/other
}
