/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputCreate } from '../../../input/create/iInputCreate';
export interface IStore<Input, Output> {
  create(input: IInputCreate<Input>): Promise<Output<Output>>;
  existent(input: IInputCreate<Input>): Promise<Output<Output>>;
}
