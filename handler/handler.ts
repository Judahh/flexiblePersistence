import { Write } from "./../write/write";
import { Read } from "./../read/read";
import { Event } from "./../event/event";
import { Operation } from "./../event/operation";
export class Handler {
    private read: Read;
    private write: Write;
    private static instance: Handler = new Handler();

    constructor() {
        this.read = Read.getInstance();
        this.write = Write.getInstance();
        
        if (Handler.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }

        Handler.instance = this;
    }

    public static getInstance(): Handler {
        return Handler.instance;
    }

    public addEvent(event: Event) {
        this.write.addEvent(event);
    }

    public readArray(array: string, callback) {
        this.read.readArray(array, callback);
    }
}