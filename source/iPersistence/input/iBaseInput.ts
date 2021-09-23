import { IEvent } from '../../event/iEvent';

export interface IBaseInput {
  scheme: string;
  receivedEvent?: IEvent | IEvent[];
}
