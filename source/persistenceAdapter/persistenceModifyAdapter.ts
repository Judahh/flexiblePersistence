import { PersistenceStoreAdapter } from './persistenceStoreAdapter';
import { PersistenceRemoveAdapter } from './persistenceRemoveAdapter';
import { PersistenceAlterAdapter } from './persistenceAlterAdapter';

export interface PersistenceModifyAdapter
  extends PersistenceStoreAdapter,
    PersistenceRemoveAdapter,
    PersistenceAlterAdapter {}
