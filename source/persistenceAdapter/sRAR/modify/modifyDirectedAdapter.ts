import { StoreDirectedAdapter } from './store/storeDirectedAdapter';
import { RemoveDirectedAdapter } from './remove/removeDirectedAdapter';
import { AlterDirectedAdapter } from './alter/alterDirectedAdapter';

export interface ModifyDirectedAdapter<Input, Output>
  extends StoreDirectedAdapter<Input, Output>,
    RemoveDirectedAdapter<Output>,
    AlterDirectedAdapter<Input, Output> {}
