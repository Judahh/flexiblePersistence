/* eslint-disable no-unused-vars */
import { Output } from '../../output/iOutput';
import { IInputRead } from '../../input/read/iInputRead';

export interface IRead<Output> {
  read(input: IInputRead): Promise<Output<Output>>;
}
