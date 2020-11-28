import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputCreate } from '../../../input/create/persistenceInputCreate';
export interface StoreAdapter {
  create(input: PersistenceInputCreate): Promise<PersistencePromise>;
  existent(input: PersistenceInputCreate): Promise<PersistencePromise>;
}
