/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedDelete } from '../../../input/delete/persistenceInputDirectedDelete';

export interface RemoveDirectedAdapter<Output> {
  nonexistent(
    input: PersistenceInputDirectedDelete
  ): Promise<PersistencePromise<Output>>;
  delete(
    input: PersistenceInputDirectedDelete
  ): Promise<PersistencePromise<Output>>;
}
