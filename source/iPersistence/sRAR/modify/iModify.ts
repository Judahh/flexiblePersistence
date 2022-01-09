import { ICreate } from './create/iCreate';
import { IDelete } from './delete/iDelete';
import { IUpdate } from './update/iUpdate';

export interface IModify<Input, Output>
  extends ICreate<Input, Output>,
    IDelete<Input, Output>,
    IUpdate<Input, Output> {}
