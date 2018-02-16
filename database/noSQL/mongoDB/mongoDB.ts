import { MongoClient, Db } from "mongodb";
import { Mongoose, Schema } from "mongoose";
import { PersistenceAdapter } from "./../../../persistenceAdapter/persistenceAdapter";

export class MongoDB implements PersistenceAdapter {
    private host: string;
    private port: number;
    private database: string;
    // private mongooseInstance: MongooseThenable;
    private mongooseInstance: Mongoose;
    private genericSchema: Schema;

    constructor(database: string, host?: string, port?: number) {
        if (host) {
            this.host = host;
        } else {
            this.host = process.env.MONGODB_HOST || "localhost";
        }
        if (port) {
            this.port = port;
        } else {
            this.port = (+process.env.MONGODB_PORT) || 27017;
        }
        this.database = database;

        // let mongoose = new Mongoose();
        this.mongooseInstance = new Mongoose();
        // this.mongooseInstance = 
        this.mongooseInstance.connect("mongodb://" + this.host + ":" + this.port + "/" + this.database, function(error) {
            if(error){
                console.error("Error:"+error);
            }
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

    public readItem(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOne(item, callback);
    }

    public readItemById(array: string, id, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findById(id, callback);
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