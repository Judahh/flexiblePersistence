import { IEvent } from '../../event/iEvent';

export interface IBaseInput<Filter, Item> {
  id?: any;
  scheme: string;
  receivedEvent?: IEvent | IEvent[];
  single?: boolean;
  selectedItem?: Filter;
  options?: any;
  additionalOptions?: any;
  eventOptions?: any;
  item?: Item | Item[];
  correct?: boolean;
}
