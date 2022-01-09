/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDelete } from '../../../input/delete/iInputDelete';

export interface IDelete<Input, Output> {
  delete(input: IInputDelete): Promise<IOutput<Input, Output>>;
}
