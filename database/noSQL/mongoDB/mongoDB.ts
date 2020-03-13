// import { MongoClient, Db } from 'mongodb';
import { Mongoose, Schema } from 'mongoose';
import { PersistenceAdapter } from './../../../persistenceAdapter/persistenceAdapter';
import { DatabaseInfo } from '../../databaseInfo';
import { PersistencePromise } from '../../../persistenceAdapter/persistencePromise';

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
        let uri = databaseInfo.uri ? databaseInfo.uri : 'mongodb://' + string +
        ':' + databaseInfo.port + '/' + databaseInfo.database;

        this.mongooseInstance.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        this.genericSchema = new this.mongooseInstance.Schema({}, { strict: false });
    }

    public updateItem(scheme: string, selectedItem: any, item: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.findOneAndUpdate(selectedItem, item, (error, doc, result) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: (doc === undefined) ? undefined : (<any>doc)._doc,
                            result: result,
                            selectedItem: selectedItem,
                            sentItem: item
                        })
                    );
                }
            });
        });
    }

    public readArray(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.find(selectedItem, (error, doc: Array<any>, result) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: (doc === undefined) ? undefined : doc.map(a => a._doc),
                            result: result,
                            selectedItem: selectedItem
                        })
                    );
                }
            });
        });
    }

    public readItem(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.findOne(selectedItem, (error, doc, result) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: (doc === undefined) ? undefined : (<any>doc)._doc,
                            result: result,
                            selectedItem: selectedItem
                        })
                    );
                }
            });
        });
    }

    public readItemById(scheme: string, id) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.findById(id, (error, doc, result) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: (doc === undefined) ? undefined : (<any>doc)._doc,
                            result: result,
                            selectedItem: id
                        })
                    );
                }
            });
        });
    }

    public deleteArray(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.deleteMany(selectedItem, (error) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            selectedItem: selectedItem
                        })
                    );
                }
            });
        });
    }

    public addItem(scheme: string, item: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.create(item, (error, doc, result) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: (doc === undefined) ? undefined : (<any>doc)._doc,
                            result: result,
                            sentItem: item
                        })
                    );
                }
            });
        });
    }

    public deleteItem(scheme: string, selectedItem: any) {
        return new Promise<PersistencePromise>((resolve, reject) => {
            let model = this.mongooseInstance.model(scheme, this.genericSchema);
            model.findByIdAndDelete(selectedItem, (error, doc) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(
                        new PersistencePromise({
                            receivedItem: doc,
                            selectedItem: selectedItem
                        })
                    );
                }
            });
        });
    }

    public getDatabaseInfo() {
        return this.databaseInfo;
    }

    public close(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.mongooseInstance.connection.close((error) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve();
                }
            });
        });
    }
}
