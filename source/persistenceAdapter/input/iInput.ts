/* eslint-disable @typescript-eslint/no-explicit-any */

import { IInputDirected } from './iInputDirected';
import { IBaseInput } from './iBaseInput';

// file deepcode ignore no-any: any needed
export interface IInput<Item> extends IInputDirected<Item>, IBaseInput {}
