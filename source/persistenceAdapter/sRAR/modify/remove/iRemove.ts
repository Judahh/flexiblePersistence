/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDelete } from '../../../input/delete/iInputDelete';

export interface IRemove<Output> {
  nonexistent(
    input: PersistenceInputDelete
  ): Promise<PersistencePromise<Output>>;
  delete(input: PersistenceInputDelete): Promise<PersistencePromise<Output>>;
}
