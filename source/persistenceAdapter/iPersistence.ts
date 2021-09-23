/* eslint-disable @typescript-eslint/no-explicit-any */
import { Default } from '@flexiblepersistence/default-initializer';
import { ISRAR } from './sRAR/iSRAR';
import { IPersistenceBase } from './iPersistenceBase';
export interface IPersistence
  //  deepcode ignore no-any: any needed
  extends ISRAR<any, any>,
    IPersistenceBase {
  element: {
    [name: string]: Default;
  };
}
