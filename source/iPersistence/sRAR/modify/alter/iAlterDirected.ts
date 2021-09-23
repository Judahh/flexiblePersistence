/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputDirectedUpdate } from '../../../input/update/iInputDirectedUpdate';

export interface IAlterDirected<Input, Output> {
  correct(input: IInputDirectedUpdate<Input>): Promise<Output<Output>>;
  update(input: IInputDirectedUpdate<Input>): Promise<Output<Output>>;
}
