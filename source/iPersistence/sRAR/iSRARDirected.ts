import { IInputDirected } from '../input/iInputDirected';
import { IOutput } from '../output/iOutput';
import { IModifyDirected } from './modify/iModifyDirected';
import { IReadDirected } from './read/iReadDirected';

export interface ISRARDirected<Input, Output>
  extends IModifyDirected<Input, Output>,
    IReadDirected<Input, Output> {
  other(
    // eslint-disable-next-line no-unused-vars
    input: IInputDirected<Input>
  ): Promise<IOutput<Input, Output>>;
}
