import { ModifyDirectedAdapter } from './modify/modifyDirectedAdapter';
import { ReadDirectedAdapter } from './read/readDirectedAdapter';

export interface SRARDirectedAdapter<Input, Output>
  extends ModifyDirectedAdapter<Input, Output>,
    ReadDirectedAdapter<Output> {}
