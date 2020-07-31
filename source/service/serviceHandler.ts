/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PersistenceAdapter,
  DatabaseInfo,
  PersistencePromise,
  // RelationValueServiceHandler,
  // SelectedItemValue,
  PersistenceInputCreate,
  PersistenceInputUpdate,
  PersistenceInputRead,
  PersistenceInputDelete,
} from '../index';
import { Pool } from 'pg';
import { ServiceInfo } from './serviceInfo';
export class ServiceHandler implements PersistenceAdapter {
  private databaseInfo: ServiceInfo;
  private pool: Pool;

  constructor(databaseInfo: ServiceInfo) {
    this.databaseInfo = databaseInfo;
    this.pool = new Pool(this.databaseInfo);
  }

  public async correct(
    input: PersistenceInputUpdate
  ): Promise<PersistencePromise> {
    //! Envia o input para o service determinado pelo esquema e lá ele faz as
    //! operações necessárias usando o journaly para acessar outros Services ou
    //! DAOs.
    //! Sempre deve-se receber informações do tipo input e o output deve ser
    //! compatível com o input para pemitir retro-alimentação.
    //! Atualizar o input para que utilize o melhor dos dois
    //! (input e parametros usados no SimpleAPI).
    //return (await this.service('selectById', id))[0];
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.correct',
        input
      )
    )[0];
  }

  public async nonexistent(
    input: PersistenceInputDelete
  ): Promise<PersistencePromise> {
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.nonexistent',
        input
      )
    )[0];
  }

  public async create(
    input: PersistenceInputCreate
  ): Promise<PersistencePromise> {
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.create',
        input
      )
    )[0];
  }
  public async update(
    input: PersistenceInputUpdate
  ): Promise<PersistencePromise> {
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.update',
        input
      )
    )[0];
  }
  public async read(input: PersistenceInputRead): Promise<PersistencePromise> {
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.read',
        input
      )
    )[0];
  }
  public async delete(
    input: PersistenceInputDelete
  ): Promise<PersistencePromise> {
    return (
      await this.databaseInfo.journaly.publish(
        input.scheme + 'Service.delete',
        input
      )
    )[0];
  }

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
