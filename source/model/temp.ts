/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
class Manager {
  private static types: any;

  public static addConstructor(constructor: any) {
    const className = constructor.name;
    if (Manager.types === undefined) {
      Manager.types = {};
    }
    if (Manager.types[className] === undefined) {
      Manager.types[className] = constructor;
    }
  }

  public static generate(className: string, ...properties: any) {
    const object = Manager.types[className];
    let properElement;
    if (object !== null && object !== undefined) {
      properElement = new object(...properties);
    }
    return properElement;
  }

  public static generateDB(object: any) {
    const objectDB = Manager.generate(object.constructor.name + 'DB');
    Manager.getParents(object, objectDB);
    objectDB._id = object._id;
    const exists = Manager.simpleGenerateDB(object.__proto__.__proto__);
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const value = object[key];
      if (!exists.includes(key)) {
        if (value instanceof Object) {
          objectDB[
            '_fk_' + value.constructor.name.toLowerCase() + 'DB_' + key
          ] = value._id;
        } else if (value instanceof Array) {
          // TODO
        } else {
          objectDB[key] = value;
        }
      }
    }
    return objectDB;
  }

  private static getParents(object: any, objectDB: any, initial?: any) {
    if (object.__proto__.constructor.name !== 'Object') {
      console.log('1:', object.__proto__.constructor.name);
      if (object.__proto__.constructor.name !== object.constructor.name) {
        console.log('2:', object.constructor.name);
        const o = initial === undefined ? object : initial;
        objectDB['_fk_' + object.__proto__.constructor.name + 'DB'] = o._id;
        console.log(o);
      }
      console.log('3:', object.constructor.name);
      Manager.getParents(
        object.__proto__,
        objectDB,
        initial === undefined ? object : initial
      );
    }
  }

  private static simpleGenerateDB(object: any) {
    const objectDB = Manager.generate(object.constructor.name + 'DB');
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const value = object[key];
      if (value instanceof Object) {
        objectDB['_fk_' + value.constructor.name.toLowerCase() + 'DB_' + key] =
          value._id;
      } else if (value instanceof Array) {
        // TODO
      } else {
        objectDB[key] = value;
      }
    }
    return Object.keys(objectDB);
  }
}

abstract class BasicModel {
  private _id: any;

  constructor(_id: any) {
    this._id = _id;
  }
}

abstract class PersistenceModel extends BasicModel {
  protected static map: {};
  private static volatileModel: VolatileModel;

  public static setVolatileModel(volatileModel: VolatileModel) {
    this.volatileModel = volatileModel;
  }

  public static generateVolatile(object: PersistenceModel) {
    const objectDB = new (<any>this.volatileModel)();
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const value = (<any>object)[key];
      if (objectDB.hasOwnProperty(key)) {
        objectDB[key] = value;
      } else {
        console.log((<any>object).map);
      }
    }
    return objectDB;
  }
}

abstract class VolatileModel extends BasicModel {
  private static persistenceModel: PersistenceModel;

  public static setPersistenceModel(persistenceModel: PersistenceModel) {
    this.persistenceModel = persistenceModel;
  }

  public static generatePersistence(object: VolatileModel) {
    const objectDB = new (<any>this.persistenceModel)();
    for (let i = 0; i < Object.keys(object).length; i++) {
      const key = Object.keys(object)[i];
      const value = (<any>object)[key];
      if (objectDB.hasOwnProperty(key)) {
        objectDB[key] = value;
      } else {
        const map = (<any>this.persistenceModel).map;
        const mKey = Object.keys(map[key])[0];
        objectDB[mKey] = (<any>object)[map[key][mKey]];
      }
    }
    return objectDB;
  }
}

class ExampleVolatileModel0 extends VolatileModel {}

class ExampleVolatileModel1 extends VolatileModel {
  private exampleVolatileModel0: ExampleVolatileModel0;
  constructor(_id: any, exampleVolatileModel0: ExampleVolatileModel0) {
    super(_id);
    this.exampleVolatileModel0 = exampleVolatileModel0;
  }
}

class ExamplePersistenceModel0 extends PersistenceModel {}

class ExamplePersistenceModel1 extends PersistenceModel {
  protected static map: { [key: string]: any } = {
    exampleVolatileModel0: { idExamplePersistenceModel0: '_id' },
  };
  private idExamplePersistenceModel0: any;
  constructor(_id: any, idExamplePersistenceModel0: any) {
    super(_id);
    this.idExamplePersistenceModel0 = idExamplePersistenceModel0;
  }
}

ExamplePersistenceModel0.setVolatileModel(<any>ExampleVolatileModel0);
ExamplePersistenceModel1.setVolatileModel(<any>ExampleVolatileModel1);
ExampleVolatileModel0.setPersistenceModel(<any>ExamplePersistenceModel0);
ExampleVolatileModel1.setPersistenceModel(<any>ExamplePersistenceModel1);

const e0 = new ExamplePersistenceModel0(0);
const e1 = new ExamplePersistenceModel1(0, 0);
const e2 = new ExampleVolatileModel0(0);
const e3 = new ExampleVolatileModel1(0, e2);

// console.log('EX1:',ExampleVolatileModel1.generatePersistence(e3));
// console.log('EX2:', ExampleVolatileModel0.generatePersistence(e2));
console.log('EX3:', ExampleVolatileModel1.generatePersistence(e3));
// console.log('EX1:',ExamplePersistenceModel1.generateVolatile(e1));
// console.log('EX2:', ExampleVolatileModel0.generatePersistence(e2));
