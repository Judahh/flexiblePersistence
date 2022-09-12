import { IBaseInput } from './iBaseInput';
import { IInputCreateOrUpdate } from './iInputCreateOrUpdate';
export interface IInputCreate<Filter = undefined, Item = unknown>
  extends IInputCreateOrUpdate,
    IBaseInput<Filter, Item> {}
