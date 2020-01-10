import { Event } from './../event/event';
import { Read } from './../read/read';
import { PersistenceAdapter } from '..';
export class Write {
    private read: Read;
    private eventDB: PersistenceAdapter;

    constructor(read: PersistenceAdapter, event: PersistenceAdapter) {
        this.read = new Read(read);
        this.eventDB = event;
    }

    public getRead(): Read {
        return this.read;
    }

    public addEvent(event: Event, callback) {
        this.eventDB.addItem('events', event, (error, result) => {
            if (error) {
                console.error(error);
            } else {
                this.read.newEvent(event, callback);
            }
        });
    }
}
