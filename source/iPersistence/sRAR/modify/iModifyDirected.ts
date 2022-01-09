import { ICreateDirected } from './create/iCreateDirected';
import { IDeleteDirected } from './delete/iDeleteDirected';
import { IUpdateDirected } from './update/iUpdateDirected';

export interface IModifyDirected<Input, Output>
  extends ICreateDirected<Input, Output>,
    IDeleteDirected<Input, Output>,
    IUpdateDirected<Input, Output> {}
