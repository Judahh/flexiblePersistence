import { PersistencePromise } from './output/persistencePromise';
import { PersistenceInputDelete } from './input/persistenceInputDelete';
import { PersistenceBaseAdapter } from './persistenceBaseAdapter';

export interface PersistenceRemoveAdapter extends PersistenceBaseAdapter {
  nonexistent(input: PersistenceInputDelete): Promise<PersistencePromise>;
  delete(input: PersistenceInputDelete): Promise<PersistencePromise>;
}
