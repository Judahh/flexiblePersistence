import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputCreate } from '../../../input/create/persistenceInputCreate';
export interface StoreAdapter<Input, Output> {
  create(
    input: PersistenceInputCreate<Input>
  ): Promise<PersistencePromise<Output>>;
  existent(
    input: PersistenceInputCreate<Input>
  ): Promise<PersistencePromise<Output>>;
}
