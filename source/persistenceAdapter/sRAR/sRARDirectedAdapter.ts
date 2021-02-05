import { PersistenceInputDirected } from '../input/persistenceInputDirected';
import { PersistencePromise } from '../output/persistencePromise';
import { ModifyDirectedAdapter } from './modify/modifyDirectedAdapter';
import { ReadDirectedAdapter } from './read/readDirectedAdapter';

export interface SRARDirectedAdapter<Input, Output>
  extends ModifyDirectedAdapter<Input, Output>,
    ReadDirectedAdapter<Output> {
  other(
    // eslint-disable-next-line no-unused-vars
    input: PersistenceInputDirected<Input>
  ): Promise<PersistencePromise<Output>>;
}
