"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventDB_1 = require("./../database/eventDB/eventDB");
const read_1 = require("./../read/read");
class Write {
    constructor() {
        this.read = read_1.Read.getInstance();
        this.eventDB = eventDB_1.EventDB.getInstance();
        if (Write.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }
        Write.instance = this;
    }
    static getInstance() {
        return Write.instance;
    }
    addEvent(event) {
        this.eventDB.addItem("events", event, (error, result) => {
            console.log("RESULT EVENT ON " + this.eventDB.getDatabase());
            if (error) {
                console.error(error);
            }
            else {
                console.log(result);
                this.read.newEvent(event);
            }
        });
    }
}
Write.instance = new Write();
exports.Write = Write;
//# sourceMappingURL=write.js.map