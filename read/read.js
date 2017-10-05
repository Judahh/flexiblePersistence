"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readDB_1 = require("./../database/readDB/readDB");
const operation_1 = require("./../event/operation");
class Read {
    constructor() {
        this.readDB = readDB_1.ReadDB.getInstance();
        if (Read.instance) {
            throw new Error("The Read is a singleton class and cannot be created!");
        }
        Read.instance = this;
    }
    static getInstance() {
        return Read.instance;
    }
    newEvent(event) {
        switch (event.getOperation()) {
            case operation_1.Operation.add:
                this.create(event);
                break;
            case operation_1.Operation.read:
                // this.read(event);
                break;
            case operation_1.Operation.correct:
            case operation_1.Operation.update:
                this.update(event);
                break;
            case operation_1.Operation.delete:
            case operation_1.Operation.nonexistent:
                this.delete(event);
                break;
        }
    }
    create(event) {
        this.readDB.addItem(event.getName(), event.getContent(), (error, result) => {
            console.log("RESULT CREATE ON:" + this.readDB.getDatabase());
            if (error) {
                console.error(error);
            }
            else {
                console.log(result);
            }
        });
    }
    readArray(array, callback) {
        this.readDB.readArray(array, callback);
    }
    update(event) {
        this.readDB.updateItem(event.getName(), event.getContent(), function (error, result) {
            console.log("RESULT UPDATE");
            if (error) {
                console.error(error);
            }
            else {
                console.log(result);
            }
        });
    }
    delete(event) {
        this.readDB.deleteItem(event.getName(), event.getContent(), function (error, result) {
            console.log("RESULT DELETE");
            if (error) {
                console.error(error);
            }
            else {
                console.log(result);
            }
        });
    }
}
Read.instance = new Read();
exports.Read = Read;
//# sourceMappingURL=read.js.map