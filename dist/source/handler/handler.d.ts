import { Write } from '../write/write';
import { Event } from '../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
export declare class Handler {
    private read?;
    private write;
    constructor(event: PersistenceAdapter, read?: PersistenceAdapter);
    getWrite(): Write;
    addEvent(event: Event): Promise<PersistencePromise>;
    readArray(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItem(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItemById(scheme: string, id: any): Promise<PersistencePromise>;
}
//# sourceMappingURL=handler.d.ts.map