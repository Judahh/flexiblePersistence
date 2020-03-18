import { PersistencePromise } from './persistencePromise';

export interface PersistenceAdapter {
    addItem(scheme: string, item: any): Promise<PersistencePromise>;
    updateArray(scheme: string, selectedItem: any, item: any): Promise<PersistencePromise>;
    updateItem(scheme: string, selectedItem: any, item: any): Promise<PersistencePromise>;
    readArray(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItem(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    readItemById(scheme: string, id: any): Promise<PersistencePromise>;
    deleteArray(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    deleteItem(scheme: string, selectedItem: any): Promise<PersistencePromise>;
    close(): Promise<any>;
    getDatabaseInfo();
}
