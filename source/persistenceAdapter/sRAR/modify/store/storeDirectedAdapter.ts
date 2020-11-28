import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedCreate } from '../../../input/create/persistenceInputDirectedCreate';
export interface StoreDirectedAdapter {
  create(input: PersistenceInputDirectedCreate): Promise<PersistencePromise>;
  existent(input: PersistenceInputDirectedCreate): Promise<PersistencePromise>;
}
