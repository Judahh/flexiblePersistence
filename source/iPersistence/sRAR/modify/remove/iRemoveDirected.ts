/* eslint-disable no-unused-vars */
import { Output } from '../../../output/iOutput';
import { IInputDirectedDelete } from '../../../input/delete/iInputDirectedDelete';

export interface IRemoveDirected<Output> {
  nonexistent(input: IInputDirectedDelete): Promise<Output<Output>>;
  delete(input: IInputDirectedDelete): Promise<Output<Output>>;
}
