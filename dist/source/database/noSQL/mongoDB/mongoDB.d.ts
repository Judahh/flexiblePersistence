import { PersistenceAdapter } from './../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { PersistencePromise } from '../../../persistenceAdapter/persistencePromise';
import { PersistenceInputCreate } from '../../../persistenceAdapter/persistenceInputCreate';
import { PersistenceInputUpdate } from '../../../persistenceAdapter/persistenceInputUpdate';
import { PersistenceInputRead } from '../../../persistenceAdapter/persistenceInputRead';
import { PersistenceInputDelete } from '../../../persistenceAdapter/persistenceInputDelete';
export declare class MongoDB implements PersistenceAdapter {
    private databaseInfo;
    private mongooseInstance;
    private genericSchema;
    constructor(databaseInfo: DatabaseInfo);
    create(input: PersistenceInputCreate): Promise<PersistencePromise>;
    update(input: PersistenceInputUpdate): Promise<PersistencePromise>;
    read(input: PersistenceInputRead): Promise<PersistencePromise>;
    delete(input: PersistenceInputDelete): Promise<PersistencePromise>;
    updateArray(scheme: string, selectedItem: any, item: any): Promise<PersistencePromise>;
    updateItem(scheme: string, selectedItem: any, item: any): Promise<PersistencePromise>;
    readArray(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItem(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItemById(scheme: string, id: any): Promise<PersistencePromise>;
    deleteArray(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    createItem(scheme: string, item: any): Promise<PersistencePromise>;
    createArray(scheme: string, items: Array<any>): Promise<PersistencePromise>;
    deleteItem(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    deleteItemById(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    getDatabaseInfo(): DatabaseInfo;
    close(): Promise<unknown>;
}
//# sourceMappingURL=mongoDB.d.ts.map