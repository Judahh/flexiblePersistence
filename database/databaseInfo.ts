export class DatabaseInfo {
    public host: string;
    public port: number;
    public database: string;
    public username: string;
    public password: string;

    constructor(database: string, host?: string, port?: number, username?: string, password?: string) {
        this.database = database;
        this.username = username;
        this.password = password;
        if (host) {
            this.host = host;
        } else {
            this.host = process.env.DB_HOST || 'localhost';
        }
        if (port) {
            this.port = port;
        } else {
            this.port = (+process.env.DB_PORT) || 27017;
        }
    }
}
