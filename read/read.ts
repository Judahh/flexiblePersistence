import { ReadDB } from './../database/readDB/readDB';
import { Event } from './../event/event';
import { Operation } from './../event/operation';
import * as MongoDB from 'mongodb';
export class Read {
    private readDB: ReadDB;
    private readMongoDB: MongoDB.Db;
    private objects: MongoDB.Collection;

    constructor(name: string, host?: string, port?: number) {
        this.readDB = new ReadDB(name, host, port);
    }

    public newEvent(event: Event) {
        switch (event.getOperation()) {
            case Operation.add:
                this.create(event);
                break;

            case Operation.read:
                // this.read(event);
                break;

            case Operation.correct:
            case Operation.update:
                this.update(event);
                break;

            case Operation.delete:
            case Operation.nonexistent:
                this.delete(event);
                break;
        }
    }

    public read(array: string, item: any, callback) {
        this.readDB.readItem(array, item, callback);
    }

    public readById(array: string, id, callback) {
        this.readDB.readItemById(array, id, callback);
    }

    public readArray(array: string, callback) {
        this.readDB.readArray(array, callback);
    }

    private create(event: Event) {
        this.readDB.addItem(event.getName(), event.getContent(), (error, result) => {
            console.log('RESULT CREATE ON:' + this.readDB.getDatabase());
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }

    private update(event: Event) {
        this.readDB.updateItem(event.getName(), event.getContent(), function (error, result) {
            console.log('RESULT UPDATE');
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }

    private delete(event: Event) {
        this.readDB.deleteItem(event.getName(), event.getContent(), function (error, result) {
            console.log('RESULT DELETE');
            if (error) {
                console.error(error);
            } else {
                console.log(result);
            }
        });
    }
}
