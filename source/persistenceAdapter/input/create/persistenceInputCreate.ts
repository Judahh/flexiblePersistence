/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceInputDirectedCreate } from './persistenceInputDirectedCreate';

// file deepcode ignore no-any: any needed
export interface PersistenceInputCreate extends PersistenceInputDirectedCreate {
  scheme: string;
}
