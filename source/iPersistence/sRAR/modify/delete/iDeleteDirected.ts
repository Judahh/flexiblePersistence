/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDirectedDelete } from '../../../input/delete/iInputDirectedDelete';

export interface IDeleteDirected<Input, Output> {
  delete(input: IInputDirectedDelete): Promise<IOutput<Input, Output>>;
}
