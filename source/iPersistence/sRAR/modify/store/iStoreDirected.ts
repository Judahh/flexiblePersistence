/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDirectedCreate } from '../../../input/create/iInputDirectedCreate';
export interface IStoreDirected<Input, Output> {
  create(input: IInputDirectedCreate<Input>): Promise<IOutput<Input, Output>>;
  existent(input: IInputDirectedCreate<Input>): Promise<IOutput<Input, Output>>;
}
