"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class MongoDB {
    constructor(database, host, port) {
        if (host) {
            this.host = host;
        }
        else {
            this.host = "localhost";
        }
        if (port) {
            this.port = port;
        }
        else {
            this.port = 27017;
        }
        this.database = database;
        var mongoose = new mongoose_1.Mongoose();
        this.mongooseInstance = mongoose.connect("mongodb://" + this.host + ":" + this.port + "/" + this.database, function (error) {
            console.error(error);
        });
        this.genericSchema = new this.mongooseInstance.Schema({}, { strict: false });
    }
    updateItem(array, item, callback) {
        var Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOneAndUpdate(item, callback);
    }
    readArray(array, callback) {
        var Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.find(callback);
    }
    deleteArray(array, callback) {
        var Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.remove(callback);
    }
    addItem(array, item, callback) {
        var Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.create(item, callback);
    }
    deleteItem(array, item, callback) {
        var Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findByIdAndRemove(item, callback);
    }
    getDatabase() {
        return this.database;
    }
}
exports.MongoDB = MongoDB;
//# sourceMappingURL=mongoDB.js.map