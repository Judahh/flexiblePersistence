/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PersistenceBaseAdapter {
  close(): Promise<any>;
  getDatabaseInfo();
}
