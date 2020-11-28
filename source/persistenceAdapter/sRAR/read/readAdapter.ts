import { PersistencePromise } from '../../output/persistencePromise';
import { PersistenceInputRead } from '../../input/read/persistenceInputRead';

export interface ReadAdapter<Output> {
  read(input: PersistenceInputRead): Promise<PersistencePromise<Output>>;
}
