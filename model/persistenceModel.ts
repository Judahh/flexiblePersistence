import { BasicModel } from './basicModel';
import { VolatileModel } from './volatileModel';

export abstract class PersistenceModel extends BasicModel {
    private static volatileModel: VolatileModel;

    public static setVolatileModel(volatileModel: VolatileModel) {
        this.volatileModel = volatileModel;
    }

    public static generateVolatile(object: any) {
        let objectDB = new (<any>this.volatileModel)();
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
