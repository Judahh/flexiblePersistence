import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputUpdate } from '../../../input/update/persistenceInputUpdate';

export interface AlterAdapter {
  correct(input: PersistenceInputUpdate): Promise<PersistencePromise>;
  update(input: PersistenceInputUpdate): Promise<PersistencePromise>;
}
