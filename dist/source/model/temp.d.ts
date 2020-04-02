declare class Manager {
    private static types;
    static addConstructor(constructor: any): void;
    static generate(className: string, ...properties: any): any;
    static generateDB(object: any): any;
    private static getParents;
    private static simpleGenerateDB;
}
declare abstract class BasicModel {
    private _id;
    constructor(_id: any);
}
declare abstract class PersistenceModel extends BasicModel {
    protected static map: {};
    private static volatileModel;
    static setVolatileModel(volatileModel: VolatileModel): void;
    static generateVolatile(object: PersistenceModel): any;
}
declare abstract class VolatileModel extends BasicModel {
    private static persistenceModel;
    static setPersistenceModel(persistenceModel: PersistenceModel): void;
    static generatePersistence(object: VolatileModel): any;
}
declare class ExampleVolatileModel0 extends VolatileModel {
}
declare class ExampleVolatileModel1 extends VolatileModel {
    private exampleVolatileModel0;
    constructor(_id: any, exampleVolatileModel0: ExampleVolatileModel0);
}
declare class ExamplePersistenceModel0 extends PersistenceModel {
}
declare class ExamplePersistenceModel1 extends PersistenceModel {
    protected static map: {
        [key: string]: any;
    };
    private idExamplePersistenceModel0;
    constructor(_id: any, idExamplePersistenceModel0: any);
}
declare const e0: ExamplePersistenceModel0;
declare const e1: ExamplePersistenceModel1;
declare const e2: ExampleVolatileModel0;
declare const e3: ExampleVolatileModel1;
//# sourceMappingURL=temp.d.ts.map