import { Operation } from "./../event/operation";
import { EventDB } from "./../database/eventDB/eventDB";
import { Event } from "./../event/event";
import { Read } from "./../read/read";
import * as MongoDB from "mongodb";
export class Write {
    private read: Read;
    private eventDB: EventDB;
    private static instance: Write = new Write();

    constructor() {
        this.read = Read.getInstance();
        this.eventDB = EventDB.getInstance();
        if (Write.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }

        Write.instance = this;
    }

    public static getInstance(): Write {
        return Write.instance;
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