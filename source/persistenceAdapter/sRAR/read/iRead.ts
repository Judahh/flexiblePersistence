/* eslint-disable no-unused-vars */
import { PersistencePromise } from '../../output/persistencePromise';
import { PersistenceInputRead } from '../../input/read/iInputRead';

export interface IRead<Output> {
  read(input: PersistenceInputRead): Promise<PersistencePromise<Output>>;
}
