import { Event } from '../event/event';
import { Read } from '../read/read';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/persistenceInputRead';
export declare class Write {
    private _read?;
    private _eventDB;
    constructor(event: PersistenceAdapter, read?: PersistenceAdapter);
    getRead(): Read | undefined;
    addEvent(event: Event): Promise<PersistencePromise>;
    read(input: PersistenceInputRead): Promise<PersistencePromise>;
    clear(scheme: string): Promise<PersistencePromise>;
}
//# sourceMappingURL=write.d.ts.map