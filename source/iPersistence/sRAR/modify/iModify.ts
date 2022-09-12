import { ICreate } from './create/iCreate';
import { IDelete } from './delete/iDelete';
import { IUpdate } from './update/iUpdate';

export interface IModify<Filter, Input, Output>
  extends ICreate<Filter, Input, Output>,
    IDelete<Filter, Input, Output>,
    IUpdate<Filter, Input, Output> {}
