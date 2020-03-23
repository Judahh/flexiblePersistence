/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicModel } from './basicModel';
import { VolatileModel } from './volatileModel';

export abstract class PersistenceModel extends BasicModel {
  private static volatileModel: VolatileModel;

  public static setVolatileModel(volatileModel: VolatileModel): void {
    this.volatileModel = volatileModel;
  }

  public static generateVolatile(object: any): any {
    const objectDB = new (<any>this.volatileModel)();
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
