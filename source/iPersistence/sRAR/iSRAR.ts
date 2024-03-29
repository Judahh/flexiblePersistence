import { IInput } from '../input/iInput';
import { IOutput } from '../output/iOutput';
import { IModify } from './modify/iModify';
import { IRead } from './read/iRead';

export interface ISRAR<Filter, Input, Output>
  extends IModify<Filter, Input, Output>,
    IRead<Filter, Input, Output> {
  // eslint-disable-next-line no-unused-vars
  other(input: IInput<Filter, Input>): Promise<IOutput<Filter, Input, Output>>;
}
