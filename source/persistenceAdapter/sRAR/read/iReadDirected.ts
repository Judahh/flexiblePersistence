/* eslint-disable no-unused-vars */
import { PersistenceInputDirectedRead } from '../../input/read/iInputDirectedRead';
import { PersistencePromise } from '../../output/persistencePromise';

export interface IReadDirected<Output> {
  read(
    input: PersistenceInputDirectedRead
  ): Promise<PersistencePromise<Output>>;
}
