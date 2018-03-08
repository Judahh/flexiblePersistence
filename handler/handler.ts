import { Write } from './../write/write';
import { Read } from './../read/read';
import { Event } from './../event/event';
import { Operation } from './../event/operation';
export class Handler {
    private read: Read;
    private write: Write;

    constructor(name: string, host?: string, port?: number, username?: string, password?: string) {
        this.write = new Write(name, host, port, username, password);
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
