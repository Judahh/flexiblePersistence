/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputCreate } from '../../../input/create/iInputCreate';
export interface IStore<Input, Output> {
  create(input: IInputCreate<Input>): Promise<IOutput<Input, Output>>;
  existent(input: IInputCreate<Input>): Promise<IOutput<Input, Output>>;
}
