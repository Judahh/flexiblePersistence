import { PoolConfig } from 'pg';
import { Info } from './info';
import { SubjectObserver } from 'journaly';
export class PersistenceInfo extends Info implements PoolConfig {
  host: string;
  port?: number;
  user?: string;
  public journaly: SubjectObserver<any>;

  constructor(info: Info, journaly: SubjectObserver<any>) {
    super();
    this.journaly = journaly;
    this.uri = info.uri;
    this.ssl = info.ssl;
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
        this.port = isNaN(Number(a[1])) ? undefined : Number(a[1]);
      }
    } else {
      this.database = info.database;
      this.user = info.username;
      this.password = info.password;
      this.options = info.options;
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
  }
}
