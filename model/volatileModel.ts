import { BasicModel } from './basicModel';
import { PersistenceModel } from './persistenceModel';

export abstract class VolatileModel extends BasicModel {
    private static persistenceModel: PersistenceModel;

    public static setPersistenceModel(persistenceModel: PersistenceModel) {
        this.persistenceModel = persistenceModel;
    }
    public static generatePersistence(object: any) {
        let objectDB = new (<any>this.persistenceModel)();
        for (let i = 0; i < Object.keys(object).length; i++) {
            let key = Object.keys(object)[i];
            let value = object[key];
            if (objectDB.hasOwnProperty(key)) {
                objectDB[key] = value;
            } else {

            }
        }
        return objectDB;
    }
}
