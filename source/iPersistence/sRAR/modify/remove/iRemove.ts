/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDelete } from '../../../input/delete/iInputDelete';

export interface IRemove<Input, Output> {
  nonexistent(input: IInputDelete): Promise<IOutput<Input, Output>>;
  delete(input: IInputDelete): Promise<IOutput<Input, Output>>;
}
