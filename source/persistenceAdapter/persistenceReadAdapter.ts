import { PersistencePromise } from './output/persistencePromise';
import { PersistenceInputRead } from './input/persistenceInputRead';
import { PersistenceBaseAdapter } from './persistenceBaseAdapter';

export interface PersistenceReadAdapter extends PersistenceBaseAdapter {
  read(input: PersistenceInputRead): Promise<PersistencePromise>;
}
