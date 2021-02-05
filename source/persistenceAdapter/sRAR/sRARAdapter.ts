import { PersistenceInput } from '../input/persistenceInput';
import { PersistencePromise } from '../output/persistencePromise';
import { ModifyAdapter } from './modify/modifyAdapter';
import { ReadAdapter } from './read/readAdapter';

export interface SRARAdapter<Input, Output>
  extends ModifyAdapter<Input, Output>,
    ReadAdapter<Output> {
  // eslint-disable-next-line no-unused-vars
  other(input: PersistenceInput<Input>): Promise<PersistencePromise<Output>>;
}
