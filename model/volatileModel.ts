/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { BasicModel } from './basicModel';
import { PersistenceModel } from './persistenceModel';

export abstract class VolatileModel extends BasicModel {
  private static persistenceModel: PersistenceModel;

  public static setPersistenceModel(persistenceModel: PersistenceModel): void {
    this.persistenceModel = persistenceModel;
  }
  public static generatePersistence(object: any): any {
    const objectDB = new (<any>this.persistenceModel)();
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const value = object[key];
      if (objectDB.hasOwnProperty(key)) {
        objectDB[key] = value;
      } else {
      }
    }
    return objectDB;
  }
}
