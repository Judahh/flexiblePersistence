/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputUpdate } from '../../../input/update/iInputUpdate';

export interface IAlter<Input, Output> {
  correct(input: IInputUpdate<Input>): Promise<IOutput<Input, Output>>;
  update(input: IInputUpdate<Input>): Promise<IOutput<Input, Output>>;
}
