/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputCreate } from '../../../input/create/iInputCreate';
export interface ICreate<Input, Output> {
  create(input: IInputCreate<Input>): Promise<IOutput<Input, Output>>;
}
