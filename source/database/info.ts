// import { ConnectOptions as ConnectionOptions } from 'mongoose';
import { ConnectionOptions } from 'mongodb';
import * as tls from 'tls';
export class Info {
  uri?: string;
  database?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  pool?: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
    acquireTimeoutMillis: number;
  };
  options?:
    | string
    | {
        encrypt: boolean;
        trustServerCertificate: boolean;
      };
  connectionType?: string;
  ssl?: ConnectionOptions | tls.ConnectionOptions | boolean | undefined;
  connectionTimeout?: number;
  requestTimeout?: number;
}
