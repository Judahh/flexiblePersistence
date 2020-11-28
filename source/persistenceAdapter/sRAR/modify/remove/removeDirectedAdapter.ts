import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedDelete } from '../../../input/delete/persistenceInputDirectedDelete';

export interface RemoveDirectedAdapter {
  nonexistent(
    input: PersistenceInputDirectedDelete
  ): Promise<PersistencePromise>;
  delete(input: PersistenceInputDirectedDelete): Promise<PersistencePromise>;
}
