/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedCreate } from '../../../input/create/persistenceInputDirectedCreate';
export interface StoreDirectedAdapter<Input, Output> {
  create(
    input: PersistenceInputDirectedCreate<Input>
  ): Promise<PersistencePromise<Output>>;
  existent(
    input: PersistenceInputDirectedCreate<Input>
  ): Promise<PersistencePromise<Output>>;
}
