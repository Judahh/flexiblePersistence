"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const write_1 = require("./../write/write");
const read_1 = require("./../read/read");
class Handler {
    constructor() {
        this.read = read_1.Read.getInstance();
        this.write = write_1.Write.getInstance();
        if (Handler.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }
        Handler.instance = this;
    }
    static getInstance() {
        return Handler.instance;
    }
    addEvent(event) {
        this.write.addEvent(event);
    }
    readArray(array, callback) {
        this.read.readArray(array, callback);
    }
}
Handler.instance = new Handler();
exports.Handler = Handler;
//# sourceMappingURL=handler.js.map