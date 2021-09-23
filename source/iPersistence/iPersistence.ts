/* eslint-disable @typescript-eslint/no-explicit-any */
import { Default } from '@flexiblepersistence/default-initializer';
import { ISRAR } from './sRAR/iSRAR';
import { IBasePersistence } from './iBasePersistence';
export interface IPersistence
  //  deepcode ignore no-any: any needed
  extends ISRAR<any, any>,
    IBasePersistence {
  element: {
    [name: string]: Default;
  };
}
