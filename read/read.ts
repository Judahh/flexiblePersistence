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
                this.readDB.addItem(event.getName(), event.getContent(), callback);
                break;

            case Operation.read:
                this.readDB.readArray(event.getName(), event.getSelection(), callback);
                break;

            case Operation.correct:
            case Operation.update:
                this.readDB.updateItem(event.getName(), event.getSelection(), event.getContent(), callback);
                break;

            case Operation.delete:
            case Operation.nonexistent:
                this.readDB.deleteItem(event.getName(), event.getSelection(), callback);
                break;
            case Operation.clear:
                this.readDB.deleteArray(event.getName(), event.getSelection(), callback);
                break;
        }
    }

    public getReadDB(): PersistenceAdapter {
        return this.readDB;
    }
}
