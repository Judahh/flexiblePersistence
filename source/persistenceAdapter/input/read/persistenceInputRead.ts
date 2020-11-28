/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegularInput } from '../regularInput';
import { PersistenceInputDirectedRead } from './persistenceInputDirectedRead';

// file deepcode ignore no-any: any needed
export interface PersistenceInputRead
  extends PersistenceInputDirectedRead,
    RegularInput {}
