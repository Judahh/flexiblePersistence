import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedUpdate } from '../../../input/update/persistenceInputDirectedUpdate';

export interface AlterDirectedAdapter<Input, Output> {
  correct(
    input: PersistenceInputDirectedUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
  update(
    input: PersistenceInputDirectedUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
}
