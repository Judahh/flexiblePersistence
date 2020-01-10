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
            '/' + databaseInfo.database, { useNewUrlParser: true, useUnifiedTopology: true });
        this.genericSchema = new this.mongooseInstance.Schema({}, { strict: false });
    }

    public updateItem(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOneAndUpdate(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public readArray(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.find(item, (error, doc: Array<any>, result) => {
            callback(error, doc.map(a => a._doc))
        });
    }

    public readItem(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findOne(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public readItemById(array: string, id, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findById(id, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public deleteArray(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.deleteMany(item, (error) => {
            callback(error)
        });
    }

    public addItem(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.create(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public deleteItem(array: string, item: any, callback?: any) {
        let Item = this.mongooseInstance.model(array, this.genericSchema);
        Item.findByIdAndDelete(item, (error, doc) => {
            callback(error, doc)
        });
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
