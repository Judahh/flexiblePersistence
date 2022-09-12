/* eslint-disable no-unused-vars */
import { IOutput } from '../../output/iOutput';
import { IInputRead } from '../../input/iInputRead';

export interface IRead<Filter, Input, Output> {
  read(
    input: IInputRead<Filter, Input>
  ): Promise<IOutput<Filter, Input, Output>>;
}
