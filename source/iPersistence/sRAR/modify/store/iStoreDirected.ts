/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputDirectedCreate } from '../../../input/create/iInputDirectedCreate';
export interface IStoreDirected<Input, Output> {
  create(input: IInputDirectedCreate<Input>): Promise<Output<Output>>;
  existent(input: IInputDirectedCreate<Input>): Promise<Output<Output>>;
}
