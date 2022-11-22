/* eslint-disable no-unused-vars */
import { IOutput } from '../../../output/iOutput';
import { IInputUpdate } from '../../../input/iInputUpdate';

export interface IUpdate<Filter = unknown, Input = unknown, Output = unknown> {
  update(
    input: IInputUpdate<Filter, Input>
  ): Promise<IOutput<Filter, Input, Output>>;
}
