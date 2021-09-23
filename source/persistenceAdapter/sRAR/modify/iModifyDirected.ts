import { IStoreDirected } from './store/iStoreDirected';
import { IRemoveDirected } from './remove/iRemoveDirected';
import { IAlterDirected } from './alter/iAlterDirected';

export interface IModifyDirected<Input, Output>
  extends IStoreDirected<Input, Output>,
    IRemoveDirected<Output>,
    IAlterDirected<Input, Output> {}
