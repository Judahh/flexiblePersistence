import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
export class Read {
    private readDB: PersistenceAdapter;

    constructor(readDB: PersistenceAdapter) {
        this.readDB = readDB;
    }

    public newEvent(event: Event, callback?) {
        switch (event.getOperation()) {
            case Operation.add:
                this.addItem(event, callback);
                break;

            case Operation.read:
                break;

            case Operation.correct:
            case Operation.update:
                this.updateItem(event, callback);
                break;

            case Operation.delete:
            case Operation.nonexistent:
                this.deleteItem(event, callback);
                break;
            case Operation.clear:
                this.deleteArray(event, callback);
                break;
        }
    }

    public readItem(scheme: string, item: any, callback?) {
        this.readDB.readItem(scheme, item, callback);
    }

    public readItemById(scheme: string, id, callback?) {
        this.readDB.readItemById(scheme, id, callback);
    }

    public readArray(scheme: string, item, callback?) {
        this.readDB.readArray(scheme, item, callback);
    }

    private addItem(event: Event, callback?) {
        this.readDB.addItem(event.getName(), event.getContent(), callback);
    }

    private updateItem(event: Event, callback?) {
        this.readDB.updateItem(event.getName(), event.getContent(), callback);
    }

    private deleteItem(event: Event, callback?) {
        this.readDB.deleteItem(event.getName(), event.getContent(), callback);
    }

    private deleteArray(event: Event, callback?) {
        this.readDB.deleteArray(event.getName(), event.getContent(), callback);
    }
}
