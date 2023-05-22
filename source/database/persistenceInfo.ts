/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PoolConfig } from 'pg';
import { Info } from './info';
import { SenderReceiver } from 'journaly';
export class PersistenceInfo extends Info implements PoolConfig {
  // @ts-ignore
  host: string | Array<string>;
  // @ts-ignore
  server: string | Array<string>;
  // @ts-ignore
  port?: number | Array<number>;
  // @ts-ignore
  uri?: string | Array<string>;
  user?: string | Array<string>;
  // @ts-ignore
  password?: string | Array<string>;
  connectionTimeout?: number;
  requestTimeout?: number;
  public journaly: SenderReceiver<any>;

  private init(info: Info) {
    this.uri = info.uri;
    this.ssl = info.ssl;
    this.pool = info.pool;
    this.connectionTimeout = info.connectionTimeout;
    this.requestTimeout = info.requestTimeout;
  }

  private initWithUri(info: Info) {
    let a;

    a = info?.uri?.split('://');
    this.host = a.length > 1 ? a[1] : a[0];
    this.connectionType = a.length > 1 ? a[0] : undefined;

    a =
      this.host && !Array.isArray(this.host) ? this.host.split('/') : undefined;
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
    a =
      this.host && !Array.isArray(this.host) ? this.host.split('@') : undefined;
    if (a && a.length > 1) {
      this.host = a[1];
      this.user = a[0];
    }

    a =
      this.user && !Array.isArray(this.user) ? this.user.split(':') : undefined;
    if (a && a.length > 1) {
      this.user = a[0];
      this.password = a[1];
    }

    a =
      this.host && !Array.isArray(this.host) ? this.host.split(':') : undefined;
    if (a && a.length > 1) {
      this.host = a[0];
      this.port = Number.isNaN(Number(a[1])) ? undefined : Number(a[1]);
    }
  }

  private getConnections() {
    const connections: string[] = [];
    if (
      Array.isArray(this.host) ||
      Array.isArray(this.port) ||
      Array.isArray(this.user) ||
      Array.isArray(this.password)
    ) {
      const hostA = Array.isArray(this.host) ? this.host : [this.host];

      const portA = Array.isArray(this.port) ? this.port : [this.port];
      const userA = Array.isArray(this.user) ? this.user : [this.user];
      const passwordA = Array.isArray(this.password)
        ? this.password
        : [this.password];

      const length = Math.max(
        hostA.length || 0,
        portA.length || 0,
        userA.length || 0,
        passwordA.length || 0
      );

      for (let index = 0; index < length; index++) {
        const host = hostA[index] || hostA[hostA.length - 1];
        const port = portA[index] || portA[portA.length - 1];
        const user = userA[index] || userA[userA.length - 1];
        const password = passwordA[index] || passwordA[passwordA.length - 1];

        connections.push(
          `${user ? user + (password ? ':' + password : '') + '@' : ''}${host}${
            port ? ':' + port : ''
          }`
        );
      }
    } else {
      connections.push(
        `${
          this.user
            ? this.user + (this.password ? ':' + this.password : '') + '@'
            : ''
        }${this.host}${this.port ? ':' + this.port : ''}`
      );
    }
    return connections;
  }

  private initWithoutUri(info: Info) {
    this.database = info.database;
    this.user = info.username;
    this.password = info.password;
    this.options = info.options;
    if (typeof info.options === 'object') {
      this.options = '';
      for (const key in info.options) {
        const element = info.options[key];
        this.options += `${key}=${element}&`;
      }
      this.options = this.options.substring(0, this.options.length - 1);
    } else {
      this.options = info.options;
    }
    this.connectionType = info.connectionType;
    if (info.host) this.host = info.host;
    else this.host = 'localhost';
    if (info.port)
      this.port = Array.isArray(info.port)
        ? info.port.map((p) => (p ? +p : p))
        : +info.port;
    const connections = this.getConnections();
    this.uri =
      (this.connectionType ? this.connectionType + '://' : '') +
      connections.join(',') +
      (this.database ? '/' + this.database : '') +
      (this.options ? '?' + this.options : '');
  }

  private initUnknow(info: Info) {
    for (const key in info) {
      if (Object.prototype.hasOwnProperty.call(info, key)) {
        const element = info[key];
        if (!this[key]) this[key] = element;
      }
    }
  }

  constructor(info: Info, journaly: SenderReceiver<any>) {
    super();
    this.journaly = journaly;
    this.init(info);
    if (info.uri) {
      this.initWithUri(info);
    } else {
      this.initWithoutUri(info);
    }
    // @ts-ignore
    this.server = this.host;
    this.initUnknow(info);
  }
}
