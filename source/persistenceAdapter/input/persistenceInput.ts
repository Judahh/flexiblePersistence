/* eslint-disable @typescript-eslint/no-explicit-any */

import { PersistenceInputDirected } from './persistenceInputDirected';
import { RegularInput } from './regularInput';

// file deepcode ignore no-any: any needed
export interface PersistenceInput
  extends PersistenceInputDirected,
    RegularInput {}
