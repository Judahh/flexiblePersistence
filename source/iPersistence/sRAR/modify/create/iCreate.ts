/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputCreate } from '../../../input/iInputCreate';
export interface ICreate<
  Filter = undefined,
  Input = unknown,
  Output = unknown
> {
  create(
    input: IInputCreate<Filter, Input>
  ): Promise<IOutput<Filter, Input, Output>>;
}
