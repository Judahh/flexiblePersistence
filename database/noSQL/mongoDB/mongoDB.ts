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

    public updateItem(scheme: string, selectedItem: any, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findOneAndUpdate(selectedItem, item, (error, doc, result) => {
            callback(error, (doc === undefined) ? undefined : (<any>doc)._doc, result, selectedItem, item);
        });
    }

    public readArray(scheme: string, selectedItem: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.find(selectedItem, (error, doc: Array<any>, result) => {
            callback(error, (doc === undefined) ? undefined : doc.map(a => a._doc), result, selectedItem, undefined);
        });
    }

    public readItem(scheme: string, selectedItem: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findOne(selectedItem, (error, doc, result) => {
            callback(error, (doc === undefined) ? undefined : doc._doc, result, selectedItem, undefined);
        });
    }

    public readItemById(scheme: string, id, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findById(id, (error, doc, result) => {
            callback(error, (doc === undefined) ? undefined : doc._doc, result, id, undefined);
        });
    }

    public deleteArray(scheme: string, selectedItem: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.deleteMany(selectedItem, (error) => {
            callback(error, undefined, undefined, selectedItem, undefined);
        });
    }

    public addItem(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.create(item, (error, doc, result) => {
            callback(error, (doc === undefined) ? undefined : doc._doc, result, undefined, item);
        });
    }

    public deleteItem(scheme: string, selectedItem: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findByIdAndDelete(selectedItem, (error, doc) => {
            callback(error, doc)
            callback(error, doc, undefined, selectedItem, undefined);
        });
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
