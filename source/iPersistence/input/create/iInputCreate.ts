/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBaseInput } from '../iBaseInput';
import { IInputDirectedCreate } from './iInputDirectedCreate';

// file deepcode ignore no-any: any needed
export interface IInputCreate<Item>
  extends IInputDirectedCreate<Item>,
    IBaseInput {}
