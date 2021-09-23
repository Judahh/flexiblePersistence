import { IDirectedEvent } from './iDirectedEvent';
import { Operation } from './operation';

export interface IEvent extends IDirectedEvent {
  operation: Operation;
}
