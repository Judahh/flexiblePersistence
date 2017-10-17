import { MongoClient, Db } from "mongodb";
import { Mongoose, MongooseThenable, Schema } from "mongoose";
import { PersistenceAdapter } from "./../../../persistenceAdapter/persistenceAdapter";

export class MongoDB implements PersistenceAdapter {
    private host: string;
    private port: number;
    private database: string;
    private mongooseInstance: MongooseThenable;
    private genericSchema: Schema;

    constructor(database: string, host?: string, port?: number) {
        if (host) {
            this.host = host;
        } else {
            this.host = "localhost";
        }
        if (port) {
            this.port = port;
        } else {
            this.port = 27017;
        }
        this.database = database;

        let mongoose = new Mongoose();
        this.mongooseInstance = mongoose.connect("mongodb://" + this.host + ":" + this.port + "/" + this.database, function(error) {
            console.error(error);
        });
        this.genericSchema = new this.mongooseInstance.Schema({}, { strict: false });
    }

    public updateItem(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOneAndUpdate(item, callback);
    }
    public readArray(array: string, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.find(callback);
    }
    public deleteArray(array: string, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.remove(callback);
    }
    public addItem(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.create(item, callback);
    }
    public deleteItem(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findByIdAndRemove(item, callback);
    }

    public getDatabase() {
        return this.database;
    }
}