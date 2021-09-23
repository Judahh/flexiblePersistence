/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBaseInput } from '../iBaseInput';
import { IInputDirectedRead } from './iInputDirectedRead';

// file deepcode ignore no-any: any needed
export interface IInputRead extends IInputDirectedRead, IBaseInput {}
