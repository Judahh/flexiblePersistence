/* eslint-disable @typescript-eslint/no-explicit-any */
import { PoolConfig } from 'pg';
import { Info } from './info';
import { SenderReceiver } from 'journaly';
export class PersistenceInfo extends Info implements PoolConfig {
  host: string;
  server: string;
  port?: number;
  user?: string;
  connectionTimeout?: number;
  requestTimeout?: number;
  public journaly: SenderReceiver<any>;

  constructor(info: Info, journaly: SenderReceiver<any>) {
    super();
    this.journaly = journaly;
    this.uri = info.uri;
    this.ssl = info.ssl;
    this.pool = info.pool;
    this.connectionTimeout = info.connectionTimeout;
    this.requestTimeout = info.requestTimeout;
    if (info.uri) {
      let a;

      a = info.uri.split('://');
      this.host = a.length > 1 ? a[1] : a[0];
      this.connectionType = a.length > 1 ? a[0] : undefined;

      a = this.host ? this.host.split('/') : undefined;
      if (a && a.length > 1) {
        this.host = a[0];
        this.database = a[1];
      }
      a = this.database ? this.database.split('?') : undefined;
      if (a && a.length > 1) {
        this.database = a[0];
        this.options = a[1];
      }
      // TODO
      a = this.host ? this.host.split('@') : undefined;
      if (a && a.length > 1) {
        this.host = a[1];
        this.user = a[0];
      }

      a = this.user ? this.user.split(':') : undefined;
      if (a && a.length > 1) {
        this.user = a[0];
        this.password = a[1];
      }

      a = this.host ? this.host.split(':') : undefined;
      if (a && a.length > 1) {
        this.host = a[0];
        this.port = Number.isNaN(Number(a[1])) ? undefined : Number(a[1]);
      }
    } else {
      this.database = info.database;
      this.user = info.username;
      this.password = info.password;
      this.options = info.options;
      if (typeof info.options === 'object') {
        this.options = '';
        for (const key in info.options) {
          if (Object.prototype.hasOwnProperty.call(info, key)) {
            const element = info[key];
            this.options += `${key}=${element}&`;
          }
        }
        this.options = this.options.substring(0, this.options.length - 1);
      } else {
        this.options = info.options;
      }
      this.connectionType = info.connectionType;
      if (info.host) this.host = info.host;
      else this.host = 'localhost';
      if (info.port) this.port = +info.port;
      this.uri =
        (this.connectionType ? this.connectionType + '://' : '') +
        (this.user
          ? this.user + (this.password ? ':' + this.password : '') + '@'
          : '') +
        (this.host ? this.host : '') +
        (this.port ? ':' + this.port : '') +
        (this.database ? '/' + this.database : '') +
        (this.options ? '?' + this.options : '');
    }
    this.server = this.host;
  }
}
