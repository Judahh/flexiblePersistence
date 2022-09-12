/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputDelete } from '../../../input/iInputDelete';

export interface IDelete<
  Filter = unknown,
  Input = undefined,
  Output = unknown
> {
  delete(
    input: IInputDelete<Filter, Input>
  ): Promise<IOutput<Filter, Input, Output>>;
}
