import { PersistencePromise } from '../../../output/persistencePromise';
import { PersistenceInputDirectedUpdate } from '../../../input/update/persistenceInputDirectedUpdate';

export interface AlterDirectedAdapter {
  correct(input: PersistenceInputDirectedUpdate): Promise<PersistencePromise>;
  update(input: PersistenceInputDirectedUpdate): Promise<PersistencePromise>;
}
