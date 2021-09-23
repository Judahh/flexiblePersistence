import { IInputDirected } from '../input/iInputDirected';
import { Output } from '../output/iOutput';
import { IModifyDirected } from './modify/iModifyDirected';
import { IReadDirected } from './read/iReadDirected';

export interface ISRARDirected<Input, Output>
  extends IModifyDirected<Input, Output>,
    IReadDirected<Output> {
  other(
    // eslint-disable-next-line no-unused-vars
    input: IInputDirected<Input>
  ): Promise<Output<Output>>;
}
