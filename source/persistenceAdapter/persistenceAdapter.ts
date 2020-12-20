/* eslint-disable @typescript-eslint/no-explicit-any */
import { Default } from '@flexiblepersistence/default-initializer';
import { SRARAdapter } from './sRAR/sRARAdapter';
import { PersistenceBaseAdapter } from './persistenceBaseAdapter';
export interface PersistenceAdapter
  //  deepcode ignore no-any: any needed
  extends SRARAdapter<any, any>,
    PersistenceBaseAdapter {
  element: {
    [name: string]: Default;
  };
}
