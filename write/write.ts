import { Operation } from "./../event/operation";
import { EventDB } from "./../database/eventDB/eventDB";
import { Event } from "./../event/event";
import { Read } from "./../read/read";
import * as MongoDB from "mongodb";
export class Write {
    private read: Read;
    private eventDB: EventDB;

    constructor(name: string, host?: string, port?: number) {
        this.read = new Read(name, host, port);
        this.eventDB = new EventDB(name, host, port);
    }

    public getRead(): Read{
        return this.read;
    }

    public addEvent(event: Event) {
        this.eventDB.addItem("events", event, (error, result)=> {
            console.log("RESULT EVENT ON "+this.eventDB.getDatabase());
            if (error) {
                console.error(error);
            } else {
                console.log(result);
                this.read.newEvent(event);
            }
        });
    }
}