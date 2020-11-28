/* eslint-disable @typescript-eslint/no-explicit-any */

import { BasicEvent } from '../..';

// file deepcode ignore no-any: any needed
export interface RegularInput {
  scheme: string;
  receivedEvent?: BasicEvent | BasicEvent[];
}
