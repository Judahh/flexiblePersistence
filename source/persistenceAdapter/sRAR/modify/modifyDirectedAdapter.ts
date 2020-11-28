import { StoreDirectedAdapter } from './store/storeDirectedAdapter';
import { RemoveDirectedAdapter } from './remove/removeDirectedAdapter';
import { AlterDirectedAdapter } from './alter/alterDirectedAdapter';

export interface ModifyDirectedAdapter
  extends StoreDirectedAdapter,
    RemoveDirectedAdapter,
    AlterDirectedAdapter {}
