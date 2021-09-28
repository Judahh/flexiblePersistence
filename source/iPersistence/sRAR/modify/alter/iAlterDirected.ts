/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDirectedUpdate } from '../../../input/update/iInputDirectedUpdate';

export interface IAlterDirected<Input, Output> {
  correct(input: IInputDirectedUpdate<Input>): Promise<IOutput<Input, Output>>;
  update(input: IInputDirectedUpdate<Input>): Promise<IOutput<Input, Output>>;
}
