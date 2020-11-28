/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceInputDirected } from './persistenceInputDirected';

// file deepcode ignore no-any: any needed
export interface PersistenceInput extends PersistenceInputDirected {
  scheme: string;
}
