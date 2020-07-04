/* eslint-disable @typescript-eslint/no-explicit-any */
import { PersistenceAdapter } from '../../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../../databaseInfo';
import { Pool } from 'pg';
import { PersistencePromise } from '../../../../persistenceAdapter/persistencePromise';
import { RelationValuePostgresDB } from './relationValuePostgresDB';
import { SelectedItemValue } from '../../../../model/selectedItemValue';
import { PersistenceInputCreate } from '../../../../persistenceAdapter/persistenceInputCreate';
import { PersistenceInputUpdate } from '../../../../persistenceAdapter/persistenceInputUpdate';
import { PersistenceInputRead } from '../../../../persistenceAdapter/persistenceInputRead';
import { PersistenceInputDelete } from '../../../../persistenceAdapter/persistenceInputDelete';
export class PostgresDB implements PersistenceAdapter {
  private databaseInfo: DatabaseInfo;
  private pool: Pool;

  constructor(databaseInfo: DatabaseInfo) {
    this.databaseInfo = databaseInfo;
    this.pool = new Pool(this.databaseInfo);
  }

  public async correct(
    input: PersistenceInputUpdate
  ): Promise<PersistencePromise> {
    //return (await this.service('selectById', id))[0];
    return (await this.journaly.publish(input.scheme + '.selectAll'))[0];
  }

  public nonexistent(
    input: PersistenceInputDelete
  ): Promise<PersistencePromise> {}

  public create(input: PersistenceInputCreate): Promise<PersistencePromise> {}
  public update(input: PersistenceInputUpdate): Promise<PersistencePromise> {}
  public read(input: PersistenceInputRead): Promise<PersistencePromise> {}
  public delete(input: PersistenceInputDelete): Promise<PersistencePromise> {}

  public getDatabaseInfo(): DatabaseInfo {
    return this.databaseInfo;
  }

  public getPool(): Pool {
    // TODO: remove
    return this.pool;
  }

  public close(): Promise<unknown> {
    return new Promise<unknown>((resolve) => {
      this.end(resolve);
    });
  }

  private end(resolve): void {
    this.pool.end(() => {
      resolve();
    });
  }
}
