export class DatabaseInfo {
    public host: string;
    public port: number;
    public database: string;
    public username: string;
    public user: string;
    public password: string;
    public uri: string;

    constructor(info: {uri?:string, database?: string, host?: string, port?: number, username?: string, password?: string}) {
        this.uri = info.uri;
        this.database = info.database;
        this.username = info.username;
        this.user = info.username;
        this.password = info.password;
        if (info.host) {
            this.host = info.host;
        } else {
            this.host = process.env.DB_HOST || 'localhost';
        }
        if (info.port) {
            this.port = info.port;
        } else {
            this.port = (+process.env.DB_PORT) || 27017;
        }
    }
}
