/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputCreate } from '../../../input/create/iInputCreate';
export interface IStore<Input, Output> {
  create(
    input: PersistenceInputCreate<Input>
  ): Promise<PersistencePromise<Output>>;
  existent(
    input: PersistenceInputCreate<Input>
  ): Promise<PersistencePromise<Output>>;
}
