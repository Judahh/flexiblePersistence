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

    public updateItem(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findOneAndUpdate(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public readArray(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.find(item, (error, doc: Array<any>, result) => {
            callback(error, doc.map(a => a._doc))
        });
    }

    public readItem(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findOne(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public readItemById(scheme: string, id, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findById(id, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public deleteArray(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.deleteMany(item, (error) => {
            callback(error)
        });
    }

    public addItem(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.create(item, (error, doc, result) => {
            callback(error, doc._doc)
        });
    }

    public deleteItem(scheme: string, item: any, callback?: any) {
        let model = this.mongooseInstance.model(scheme, this.genericSchema);
        model.findByIdAndDelete(item, (error, doc) => {
            callback(error, doc)
        });
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }
}
