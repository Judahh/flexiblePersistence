/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputUpdate } from '../../../input/update/iInputUpdate';

export interface IAlter<Input, Output> {
  correct(
    input: PersistenceInputUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
  update(
    input: PersistenceInputUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
}
