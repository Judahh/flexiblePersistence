/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegularInput } from '../regularInput';
import { PersistenceInputDirectedDelete } from './persistenceInputDirectedDelete';

// file deepcode ignore no-any: any needed
export interface PersistenceInputDelete
  extends PersistenceInputDirectedDelete,
    RegularInput {}
