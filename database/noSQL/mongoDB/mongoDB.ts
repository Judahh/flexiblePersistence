// import { MongoClient, Db } from 'mongodb';
import { Mongoose, Schema } from 'mongoose';
import { PersistenceAdapter } from './../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';

export class MongoDB implements PersistenceAdapter {
    private databaseInfo: DatabaseInfo;
    private mongooseInstance: Mongoose;
    private genericSchema: Schema;

    constructor(databaseInfo: DatabaseInfo) {
        let string;
        if (databaseInfo.username !== undefined && databaseInfo.password !== undefined) {
            string = databaseInfo.username + ':' + databaseInfo.password + '@' + databaseInfo.host;
        } else {
            string = databaseInfo.host;
        }

        this.databaseInfo = databaseInfo;

        // let mongoose = new Mongoose();
        this.mongooseInstance = new Mongoose();
        // this.mongooseInstance =
        this.mongooseInstance.connect('mongodb://' + string + ':' + databaseInfo.port +
            '/' + databaseInfo.database, { useNewUrlParser: true });
        this.genericSchema = new this.mongooseInstance.Schema({}, { strict: false });
    }

    public updateItem(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOneAndUpdate(item, callback);
    }

    public readArray(array: string, item: any, callback) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.find(item, callback);
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

    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
