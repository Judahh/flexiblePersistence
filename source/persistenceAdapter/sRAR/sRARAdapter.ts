import { ModifyAdapter } from './modify/modifyAdapter';
import { ReadAdapter } from './read/readAdapter';

export interface SRARAdapter<Input, Output>
  extends ModifyAdapter<Input, Output>,
    ReadAdapter<Output> {}
