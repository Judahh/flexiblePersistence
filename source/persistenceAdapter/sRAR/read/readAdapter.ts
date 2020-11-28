import { PersistencePromise } from '../../output/persistencePromise';
import { PersistenceInputRead } from '../../input/read/persistenceInputRead';

export interface ReadAdapter {
  read(input: PersistenceInputRead): Promise<PersistencePromise>;
}
