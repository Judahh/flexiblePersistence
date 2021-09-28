/* eslint-disable no-unused-vars */
import { IOutput } from '../../output/iOutput';
import { IInputRead } from '../../input/read/iInputRead';

export interface IRead<Input, Output> {
  read(input: IInputRead): Promise<IOutput<Input, Output>>;
}
