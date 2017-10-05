"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDB_1 = require("./../noSQL/mongoDB/mongoDB");
class ReadDB extends mongoDB_1.MongoDB {
    constructor(host, port) {
        super("readDB", host, port);
        if (ReadDB.instance) {
            throw new Error("The Write is a singleton class and cannot be created!");
        }
        ReadDB.instance = this;
    }
    static getInstance() {
        return ReadDB.instance;
    }
}
ReadDB.instance = new ReadDB();
exports.ReadDB = ReadDB;
//# sourceMappingURL=readDB.js.map