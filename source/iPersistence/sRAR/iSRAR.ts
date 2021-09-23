import { IInput } from '../input/iInput';
import { IOutput } from '../output/iOutput';
import { IModify } from './modify/iModify';
import { IRead } from './read/iRead';

export interface ISRAR<Input, Output>
  extends IModify<Input, Output>,
    IRead<Output> {
  // eslint-disable-next-line no-unused-vars
  other(input: IInput<Input>): Promise<IOutput<Input, Output>>;
}
