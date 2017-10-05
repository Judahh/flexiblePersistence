import { MongoDB } from "./../noSQL/mongoDB/mongoDB";
export class EventDB extends MongoDB {
    private static instance: EventDB = new EventDB();

    constructor(host?: string, port?: number) {
        super("eventDB", host, port);
        if (EventDB.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }
        EventDB.instance = this;
    }

    public static getInstance(): EventDB {
        return EventDB.instance;
    }
}