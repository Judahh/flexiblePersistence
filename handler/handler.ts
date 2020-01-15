import { Write } from './../write/write';
import { Read } from './../read/read';
import { Event } from './../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
export class Handler {
    private read: Read;
    private write: Write;

    constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
        this.write = new Write(event, read);
        if (read) {
            this.read = this.write.getRead();
        }
    }

    public addEvent(event: Event, callback?) {
        this.write.addEvent(event, callback);
    }

    public readArray(scheme: string, selectedItem: any, callback?) {
        if (this.read) {
            this.read.getReadDB().readArray(scheme, selectedItem, callback);
        } else {
            this.write.readArray(scheme, selectedItem, callback);
        }
    }

    public readItem(scheme: string, selectedItem: any, callback?) {
        if (this.read) {
            this.read.getReadDB().readItem(scheme, selectedItem, callback);
        } else {
            this.write.readItem(scheme, selectedItem, callback);
        }
    }

    public readItemById(scheme: string, id, callback?) {
        if (this.read) {
            this.read.getReadDB().readItemById(scheme, id, callback);
        } else {
            this.write.readItemById(scheme, id, callback);
        }
    }
}
