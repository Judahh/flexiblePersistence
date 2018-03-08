import { Write } from './../write/write';
import { Read } from './../read/read';
import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { Database } from '../database/database';
export class Handler {
    private read: Read;
    private write: Write;

    constructor(database: Database, database2?: Database) {
        this.write = new Write(database, database2);
        this.read = this.write.getRead();
    }

    public addEvent(event: Event) {
        this.write.addEvent(event);
    }

    public readArray(array: string, callback) {
        this.read.readArray(array, callback);
    }

    public readOne(array: string, item: any, callback) {
        this.read.read(array, item, callback);
    }

    public readById(array: string, id, callback) {
        this.read.readById(array, id, callback);
    }
}
