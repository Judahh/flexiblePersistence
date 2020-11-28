/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegularInput } from '../regularInput';
import { PersistenceInputDirectedUpdate } from './persistenceInputDirectedUpdate';

// file deepcode ignore no-any: any needed
export interface PersistenceInputUpdate
  extends PersistenceInputDirectedUpdate,
    RegularInput {}
