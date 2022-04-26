import { Operation } from './operation';
import { SubType } from './subType';
import { Type } from './type';

export type FullOperation = {
  operation?: Operation;
  type?: Type;
  subType?: SubType;
};
