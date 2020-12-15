/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PersistenceBaseAdapter {
  close(): Promise<boolean>;
  clear(): Promise<boolean>;
  getPersistenceInfo();
}
