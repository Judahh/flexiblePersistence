import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDelete } from '../../../input/delete/persistenceInputDelete';

export interface RemoveAdapter {
  nonexistent(input: PersistenceInputDelete): Promise<PersistencePromise>;
  delete(input: PersistenceInputDelete): Promise<PersistencePromise>;
}
