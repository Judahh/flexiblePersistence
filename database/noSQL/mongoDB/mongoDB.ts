import { MongoClient, Db } from 'mongodb';
import { Mongoose, Schema } from 'mongoose';
import { PersistenceAdapter } from './../../../persistenceAdapter/persistenceAdapter';
import { Database } from '../../database';

export class MongoDB implements PersistenceAdapter {
    private database: Database;
    private mongooseInstance: Mongoose;
    private genericSchema: Schema;

    constructor(database: Database) {
        let string;
        if (database.username !== undefined && database.password !== undefined) {
            string = database.username + ':' + database.password + '@' + database.host;
        } else {
            string = database.host;
        }

        this.database = database;

        // let mongoose = new Mongoose();
        this.mongooseInstance = new Mongoose();
        // this.mongooseInstance =
        this.mongooseInstance.connect('mongodb://' + string + ':' + database.port + '/' + database.database, {useNewUrlParser: true});
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

    public getDatabase() {
        return this.database;
    }
}
