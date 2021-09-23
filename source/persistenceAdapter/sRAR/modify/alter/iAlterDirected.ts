/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedUpdate } from '../../../input/update/iInputDirectedUpdate';

export interface IAlterDirected<Input, Output> {
  correct(
    input: PersistenceInputDirectedUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
  update(
    input: PersistenceInputDirectedUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
}
