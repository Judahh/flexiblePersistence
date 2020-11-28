import { StoreAdapter } from './store/storeAdapter';
import { RemoveAdapter } from './remove/removeAdapter';
import { AlterAdapter } from './alter/alterAdapter';

export interface ModifyAdapter<Input, Output>
  extends StoreAdapter<Input, Output>,
    RemoveAdapter<Output>,
    AlterAdapter<Input, Output> {}
