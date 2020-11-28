/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceInputDirectedDelete } from './persistenceInputDirectedDelete';

// file deepcode ignore no-any: any needed
export interface PersistenceInputDelete extends PersistenceInputDirectedDelete {
  scheme: string;
}
