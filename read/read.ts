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
                this.create(event, callback);
                break;

            case Operation.read:
                break;

            case Operation.correct:
            case Operation.update:
                this.update(event, callback);
                break;

            case Operation.delete:
            case Operation.nonexistent:
                this.delete(event, callback);
                break;
            case Operation.clear:
                this.clear(event, callback);
                break;
        }
    }

    public read(array: string, item: any, callback?) {
        this.readDB.readItem(array, item, callback);
    }

    public readById(array: string, id, callback?) {
        this.readDB.readItemById(array, id, callback);
    }

    public readArray(array: string, item, callback?) {
        this.readDB.readArray(array, item, callback);
    }

    private create(event: Event, callback?) {
        this.readDB.addItem(event.getName(), event.getContent(), callback);
    }

    private update(event: Event, callback?) {
        this.readDB.updateItem(event.getName(), event.getContent(), callback);
    }

    private delete(event: Event, callback?) {
        this.readDB.deleteItem(event.getName(), event.getContent(), callback);
    }

    private clear(event: Event, callback?) {
        this.readDB.deleteArray(event.getName(), event.getContent(), callback);
    }
}
