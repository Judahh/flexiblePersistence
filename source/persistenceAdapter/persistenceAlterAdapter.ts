import { PersistenceBaseAdapter } from './persistenceBaseAdapter';
import { PersistencePromise } from './output/persistencePromise';
import { PersistenceInputUpdate } from './input/persistenceInputUpdate';

export interface PersistenceAlterAdapter extends PersistenceBaseAdapter {
  correct(input: PersistenceInputUpdate): Promise<PersistencePromise>;
  update(input: PersistenceInputUpdate): Promise<PersistencePromise>;
}
