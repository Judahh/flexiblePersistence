/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBaseInput } from '../iBaseInput';
import { IInputDirectedUpdate } from './iInputDirectedUpdate';

// file deepcode ignore no-any: any needed
export interface IInputUpdate<Item>
  extends IInputDirectedUpdate<Item>,
    IBaseInput {}
