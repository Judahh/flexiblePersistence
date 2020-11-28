import { StoreAdapter } from './store/storeAdapter';
import { RemoveAdapter } from './remove/removeAdapter';
import { AlterAdapter } from './alter/alterAdapter';

export interface ModifyAdapter
  extends StoreAdapter,
    RemoveAdapter,
    AlterAdapter {}
