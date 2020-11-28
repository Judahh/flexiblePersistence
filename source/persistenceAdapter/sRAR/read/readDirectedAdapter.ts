import { PersistenceInputDirectedRead } from '../../input/read/persistenceInputDirectedRead';
import { PersistencePromise } from '../../output/persistencePromise';

export interface ReadDirectedAdapter {
  read(input: PersistenceInputDirectedRead): Promise<PersistencePromise>;
}
