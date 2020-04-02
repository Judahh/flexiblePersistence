/// <reference types="node" />
import { PoolConfig } from 'pg';
import { ConnectionOptions } from 'mongoose';
import * as tls from 'tls';
export declare class DatabaseInfo implements PoolConfig {
    host: string;
    port?: number;
    database?: string;
    user?: string;
    password?: string;
    uri?: string;
    options?: string;
    connectionType?: string;
    ssl: ConnectionOptions | tls.ConnectionOptions | boolean | undefined;
    constructor(info: {
        uri?: string;
        database?: string;
        host?: string;
        port?: number | string;
        username?: string;
        password?: string;
        options?: string;
        connectionType?: string;
        ssl?: ConnectionOptions | tls.ConnectionOptions | boolean;
    });
}
//# sourceMappingURL=databaseInfo.d.ts.map