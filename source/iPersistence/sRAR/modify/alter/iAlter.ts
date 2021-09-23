/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputUpdate } from '../../../input/update/iInputUpdate';

export interface IAlter<Input, Output> {
  correct(input: IInputUpdate<Input>): Promise<Output<Output>>;
  update(input: IInputUpdate<Input>): Promise<Output<Output>>;
}
