export interface ITransaction {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  begin(options?): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
