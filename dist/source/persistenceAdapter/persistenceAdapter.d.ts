import { PersistencePromise } from './persistencePromise';
import { PersistenceInputCreate } from './persistenceInputCreate';
import { PersistenceInputUpdate } from './persistenceInputUpdate';
import { PersistenceInputDelete } from './persistenceInputDelete';
import { PersistenceInputRead } from './persistenceInputRead';
export interface PersistenceAdapter {
    create(input: PersistenceInputCreate): Promise<PersistencePromise>;
    update(input: PersistenceInputUpdate): Promise<PersistencePromise>;
    read(input: PersistenceInputRead): Promise<PersistencePromise>;
    delete(input: PersistenceInputDelete): Promise<PersistencePromise>;
    close(): Promise<any>;
    getDatabaseInfo(): any;
}
//# sourceMappingURL=persistenceAdapter.d.ts.map