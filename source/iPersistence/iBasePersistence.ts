/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBasePersistence {
  close(): Promise<boolean>;
  clear(): Promise<boolean>;
  getPersistenceInfo();

  // eslint-disable-next-line no-unused-vars
  transaction(callback: (transaction) => Promise<void>, options): Promise<any>;
}
