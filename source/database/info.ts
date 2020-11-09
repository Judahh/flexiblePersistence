import { ConnectionOptions } from 'mongoose';
import * as tls from 'tls';
export class Info {
  uri?: string;
  database?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  options?: string;
  connectionType?: string;
  ssl?: ConnectionOptions | tls.ConnectionOptions | boolean | undefined;
}
