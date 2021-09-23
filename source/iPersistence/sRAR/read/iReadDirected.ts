/* eslint-disable no-unused-vars */
import { IInputDirectedRead } from '../../input/read/iInputDirectedRead';
import { Output } from '../../output/iOutput';

export interface IReadDirected<Output> {
  read(input: IInputDirectedRead): Promise<Output<Output>>;
}
