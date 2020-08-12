import { PersistencePromise } from './output/persistencePromise';
import { PersistenceInputCreate } from './input/persistenceInputCreate';
import { PersistenceBaseAdapter } from './persistenceBaseAdapter';
export interface PersistenceStoreAdapter extends PersistenceBaseAdapter {
  create(input: PersistenceInputCreate): Promise<PersistencePromise>;
  // existent(input: PersistenceInputCreate): Promise<PersistencePromise>;
}
