import { BasicDirectedEvent } from './basicDirectedEvent';
import { Operation } from './operation';

export interface BasicEvent extends BasicDirectedEvent {
  operation: Operation;
  receivedContent?: BasicEvent | BasicEvent[];
}
