import { IBaseInput } from './iBaseInput';
import { IInputCreateOrUpdate } from './iInputCreateOrUpdate';
export interface IInputUpdate<Filter = unknown, Item = unknown>
  extends IInputCreateOrUpdate,
    IBaseInput<Filter, Item> {}
