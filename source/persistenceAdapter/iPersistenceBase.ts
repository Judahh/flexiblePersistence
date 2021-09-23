/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPersistenceBase {
  close(): Promise<boolean>;
  clear(): Promise<boolean>;
  getPersistenceInfo();
}
