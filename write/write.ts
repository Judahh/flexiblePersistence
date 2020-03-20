/* eslint-disable @typescript-eslint/no-explicit-any */

import { Event } from './../event/event';
import { Read } from './../read/read';
import { PersistenceAdapter } from '..';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
export class Write {
    private read?: Read;
    private eventDB: PersistenceAdapter;

    constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
        this.eventDB = event;
        if (read) {
            this.read = new Read(read);
        }
    }

    public getRead(): Read | undefined {
        return this.read;
    }

    public addEvent(event: Event): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.eventDB.addItem('events', event).then((persistencePromise: PersistencePromise) => {
                event['_id'] = persistencePromise.receivedItem._id;
                event['__v'] = persistencePromise.receivedItem.__v;
                if (this.read) {
                    this.read.newEvent(event).then(resolve).catch(reject);
                } else {
                    resolve(persistencePromise);
                }
            }).catch(reject);
        });
    }

    public readArray(scheme: string, selectedItem: any): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.eventDB.readArray(scheme, selectedItem).then(resolve).catch(reject);
        });
    }

    public readItem(scheme: string, selectedItem: any): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.eventDB.readItem(scheme, selectedItem).then(resolve).catch(reject);
        });
    }

    public readItemById(scheme: string, id): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.eventDB.readItemById(scheme, id).then(resolve).catch(reject);
        });
    }

    public clear(scheme: string): Promise<PersistencePromise> {
        return new Promise<PersistencePromise>((resolve, reject) => {
            this.eventDB.deleteArray(scheme, {}).then(resolve).catch(reject);
        });
    }
}
