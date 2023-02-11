/* eslint-disable no-unused-vars */

import { ITransaction } from './iTransaction';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBasePersistence {
  close(): Promise<boolean>;
  clear(): Promise<boolean>;
  getPersistenceInfo();
  transaction(
    options?,
    callback?: (transaction) => Promise<void>
  ): Promise<ITransaction>;
}
