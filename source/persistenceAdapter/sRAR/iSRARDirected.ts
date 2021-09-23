import { PersistenceInputDirected } from '../input/iInputDirected';
import { PersistencePromise } from '../output/persistencePromise';
import { IModifyDirected } from './modify/iModifyDirected';
import { IReadDirected } from './read/iReadDirected';

export interface ISRARDirected<Input, Output>
  extends IModifyDirected<Input, Output>,
    IReadDirected<Output> {
  other(
    // eslint-disable-next-line no-unused-vars
    input: PersistenceInputDirected<Input>
  ): Promise<PersistencePromise<Output>>;
}
