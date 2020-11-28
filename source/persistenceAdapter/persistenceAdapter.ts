import { Default } from 'default-initializer';
import { SRARAdapter } from './sRAR/sRARAdapter';
import { PersistenceBaseAdapter } from './persistenceBaseAdapter';
export interface PersistenceAdapter
  extends SRARAdapter,
    PersistenceBaseAdapter {
  element: {
    [name: string]: Default;
  };
}
