/* eslint-disable no-unused-vars */
import { IInputDirectedRead } from '../../input/read/iInputDirectedRead';
import { IOutput } from '../../output/iOutput';

export interface IReadDirected<Input, Output> {
  read(input: IInputDirectedRead): Promise<IOutput<Input, Output>>;
}
