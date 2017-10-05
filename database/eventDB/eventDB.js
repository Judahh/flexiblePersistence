"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDB_1 = require("./../noSQL/mongoDB/mongoDB");
class EventDB extends mongoDB_1.MongoDB {
    constructor(host, port) {
        super("eventDB", host, port);
        if (EventDB.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }
        EventDB.instance = this;
    }
    static getInstance() {
        return EventDB.instance;
    }
}
EventDB.instance = new EventDB();
exports.EventDB = EventDB;
//# sourceMappingURL=eventDB.js.map