/* eslint-disable @typescript-eslint/no-explicit-any */

import { RegularInput } from '../regularInput';
import { PersistenceInputDirectedCreate } from './persistenceInputDirectedCreate';

// file deepcode ignore no-any: any needed
export interface PersistenceInputCreate<Item>
  extends PersistenceInputDirectedCreate<Item>,
    RegularInput {}
