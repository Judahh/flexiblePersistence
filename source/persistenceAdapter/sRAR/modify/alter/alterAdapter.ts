import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputUpdate } from '../../../input/update/persistenceInputUpdate';

export interface AlterAdapter<Input, Output> {
  correct(
    input: PersistenceInputUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
  update(
    input: PersistenceInputUpdate<Input>
  ): Promise<PersistencePromise<Output>>;
}
