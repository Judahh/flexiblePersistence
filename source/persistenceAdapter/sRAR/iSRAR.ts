import { PersistenceInput } from '../input/iInput';
import { PersistencePromise } from '../output/persistencePromise';
import { IModify } from './modify/iModify';
import { IRead } from './read/iRead';

export interface ISRAR<Input, Output>
  extends IModify<Input, Output>,
    IRead<Output> {
  // eslint-disable-next-line no-unused-vars
  other(input: PersistenceInput<Input>): Promise<PersistencePromise<Output>>;
}
