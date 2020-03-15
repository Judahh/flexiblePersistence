export class DatabaseInfo {
  public host: string;
  public port: number;
  public database: string;
  public username: string;
  public user: string;
  public password: string;
  public uri: string;

  constructor(info: {
    uri?: string;
    database?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
  }) {
    this.uri = info.uri;
    if (info.uri) {
      info.uri = info.uri.split("://")[1];
      let a = info.uri.split(":");
      let b = a[1].split("@");
      this.user = a[0];
      this.username = a[0];
      this.password = b[0];
      this.host = b[1];
      a = a[2].split("/", 2);
      this.port = Number(a[0]);
      this.database = a[1];
    } else {
      this.database = info.database;
      this.username = info.username;
      this.user = info.username;
      this.password = info.password;
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
    }
  }
}
