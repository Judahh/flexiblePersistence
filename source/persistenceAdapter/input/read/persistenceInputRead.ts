/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceInputDirectedRead } from './persistenceInputDirectedRead';

// file deepcode ignore no-any: any needed
export interface PersistenceInputRead extends PersistenceInputDirectedRead {
  scheme: string;
}
