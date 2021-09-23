/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputDelete } from '../../../input/delete/iInputDelete';

export interface IRemove<Output> {
  nonexistent(input: IInputDelete): Promise<Output<Output>>;
  delete(input: IInputDelete): Promise<Output<Output>>;
}
