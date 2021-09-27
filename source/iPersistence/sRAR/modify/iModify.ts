import { IStore } from './store/iStore';
import { IRemove } from './remove/iRemove';
import { IAlter } from './alter/iAlter';

export interface IModify<Input, Output>
  extends IStore<Input, Output>,
    IRemove<Input, Output>,
    IAlter<Input, Output> {}
