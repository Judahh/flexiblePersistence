/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBasePersistence {
  close(): Promise<boolean>;
  clear(): Promise<boolean>;
  getPersistenceInfo();
}
