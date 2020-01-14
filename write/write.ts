import { Event } from './../event/event';
import { Read } from './../read/read';
import { PersistenceAdapter } from '..';
export class Write {
    private read: Read;
    private eventDB: PersistenceAdapter;

    constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
        this.eventDB = event;
        if (read) {
            this.read = new Read(read);
        }
    }

    public getRead(): Read {
        return this.read;
    }

    public addEvent(event: Event, callback?) {
        this.eventDB.addItem('events', event, (error, result) => {
            if (error) {
                throw new Error(error);
            } else {
                event['_id'] = result._id;
                event['__v'] = result.__v;
                if (this.read) {
                    this.read.newEvent(event, callback);
                } else {
                    callback(error, event);
                }
            }
        });
    }

    public readArray(scheme: string, item, callback?) {
        this.eventDB.readArray(scheme, item, callback);
    }

    public readItem(scheme: string, item: any, callback?) {
        this.eventDB.readItem(scheme, item, callback);
    }

    public readItemById(scheme: string, id, callback?) {
        this.eventDB.readItemById(scheme, id, callback);
    }
}
