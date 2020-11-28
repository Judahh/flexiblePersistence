import { ModifyDirectedAdapter } from './modify/modifyDirectedAdapter';
import { ReadDirectedAdapter } from './read/readDirectedAdapter';

export interface SRARDirectedAdapter
  extends ModifyDirectedAdapter,
    ReadDirectedAdapter {}
