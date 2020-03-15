export class DatabaseInfo {
  public host: string;
  public port: number;
  public database: string;
  public username: string;
  public user: string;
  public password: string;
  public uri: string;
  public options: string;
  public connection: string;

  constructor(info: {
    uri?: string;
    database?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    options?: string;
    connection?: string;
  }) {
    this.uri = info.uri;
    if (info.uri) {
      let a;

      a = info.uri.split("://");
      this.host = a.length > 1 ? a[1] : a[0];
      this.connection = a.length > 1 ? a[0] : undefined;

      a = this.host ? this.host.split("/") : undefined;
      if (a && a.length > 1) {
        this.host = a[0];
        this.database = a[1];
      }
      a = this.database ? this.database.split("?") : undefined;
      if (a && a.length > 1) {
        this.database = a[0];
        this.options = a[1];
      }
      //TODO
      a = this.host ? this.host.split("@") : undefined;
      if (a && a.length > 1) {
        this.host = a[1];
        this.user = a[0];
      }

      a = this.user ? this.user.split(":") : undefined;
      if (a && a.length > 1) {
        this.user = a[0];
        this.password = a[1];
      }

      a = this.host ? this.host.split(":") : undefined;
      if (a && a.length > 1) {
        this.host = a[0];
        this.port = isNaN(Number(a[1])) ? undefined : Number(a[1]);
      }

      this.username = this.user;
    } else {
      this.database = info.database;
      this.username = info.username;
      this.user = info.username;
      this.password = info.password;
      this.options = info.options;
      this.connection = info.connection;
      if (info.host) {
        this.host = info.host;
      } else {
        this.host = process.env.DB_HOST || "localhost";
      }
      if (info.port) {
        this.port = info.port;
      } else {
        this.port = +process.env.DB_PORT || 27017;
      }
      this.uri =
        (this.connection ? this.connection + "://" : "") +
        (this.user
          ? this.username + (this.password ? ":" + this.password : "") + "@"
          : "") +
        (this.host ? this.host : "") +
        (this.port ? ":" + this.port : "") +
        (this.database ? "/" + this.database : "") +
        (this.options ? "?" + this.options : "");
    }
  }
}
