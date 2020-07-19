import { Event } from './../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
export declare class Read {
    private readDB;
    constructor(readDB: PersistenceAdapter);
    newEvent(event: Event): Promise<PersistencePromise>;
    getReadDB(): PersistenceAdapter;
}
//# sourceMappingURL=read.d.ts.map