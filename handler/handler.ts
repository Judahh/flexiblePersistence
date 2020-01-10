import { Write } from './../write/write';
import { Read } from './../read/read';
import { Event } from './../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
export class Handler {
    private read: Read;
    private write: Write;

    constructor(database: PersistenceAdapter, database2: PersistenceAdapter) {
        this.write = new Write(database, database2);
        this.read = this.write.getRead();
    }

    public addEvent(event: Event, callback) {
        this.write.addEvent(event, callback);
    }

    public readArray(array: string, item, callback) {
        this.read.readArray(array, item, callback);
    }

    public readOne(array: string, item: any, callback) {
        this.read.read(array, item, callback);
    }

    public readById(array: string, id, callback) {
        this.read.readById(array, id, callback);
    }
}
