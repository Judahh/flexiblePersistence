
// class Manager {
//     private static types: any;

//     public static addConstructor(constructor: any) {
//         let className = constructor.name;
//         if (Manager.types === undefined) {
//             Manager.types = {};
//         }
//         if (Manager.types[className] === undefined) {
//             Manager.types[className] = constructor;
//         }
//     }

//     public static generate(className: string, ...properties: any) {
//         let object = Manager.types[className];
//         let properElement;
//         if (object !== null && object !== undefined) {
//             properElement = new object(...properties);
//         }
//         return properElement;
//     }

//     public static generateDB(object: any) {
//         let objectDB = Manager.generate(object.constructor.name + 'DB');
//         Manager.getParents(object, objectDB);
//         objectDB._id = object._id;
//         let exists = Manager.simpleGenerateDB(object.__proto__.__proto__);
//         for (let i = 0; i < Object.keys(object).length; i++) {
//             let key = Object.keys(object)[i];
//             let value = object[key];
//             if (!exists.includes(key)) {
//                 if (value instanceof Object) {
//                     objectDB['_fk_' + value.constructor.name.toLowerCase() + 'DB_' + key] = value._id;
//                 } else if (value instanceof Array) {
//                     // TODO
//                 } else {
//                     objectDB[key] = value;
//                 }
//             }
//         }
//         return objectDB;
//     }

//     private static getParents(object: any, objectDB: any, initial?: any) {
//         if (object.__proto__.constructor.name !== 'Object') {
//             console.log('1:', object.__proto__.constructor.name)
//             if (object.__proto__.constructor.name !== object.constructor.name) {
//                 console.log('2:', object.constructor.name)
//                 let o = (initial === undefined) ? object : initial;
//                 objectDB['_fk_' + object.__proto__.constructor.name + 'DB'] = o._id;
//                 console.log(o)
//             }
//             console.log('3:', object.constructor.name)
//             Manager.getParents(object.__proto__, objectDB, (initial === undefined) ? object : initial);
//         }
//     }

//     private static simpleGenerateDB(object: any) {
//         let objectDB = Manager.generate(object.constructor.name + 'DB');
//         for (let i = 0; i < Object.keys(object).length; i++) {
//             let key = Object.keys(object)[i];
//             let value = object[key];
//             if (value instanceof Object) {
//                 objectDB['_fk_' + value.constructor.name.toLowerCase() + 'DB_' + key] = value._id;
//             } else if (value instanceof Array) {
//                 // TODO
//             } else {
//                 objectDB[key] = value;
//             }
//         }
//         return Object.keys(objectDB);
//     }
// }

// abstract class IIVendorDB {
//     public _id: number;
//     constructor(_id: number) {
//         this._id = _id;
//     }
// }
// Manager.addConstructor(IIVendorDB);

// abstract class IVendorDB extends IIVendorDB {
//     public name: string;
//     constructor(_id: number, name: string) {
//         super(_id);
//         this.name = name;
//     }
// }
// Manager.addConstructor(IVendorDB);

// abstract class IIVendor {
//     public _id: number;
//     constructor(_id: number) {
//         this._id = _id;
//     }
// }
// Manager.addConstructor(IIVendor);

// abstract class IVendor extends IIVendor {
//     public name: string;
//     constructor(_id: number, name: string) {
//         super(_id);
//         this.name = name;
//     }
// }
// Manager.addConstructor(IVendor);

// class Vendor extends IVendor {
//     public vendor2: Vendor2;

//     constructor(_id: number, name: string, vendor2: Vendor2) {
//         super(_id, name);
//         this.vendor2 = vendor2;
//     }
// }
// Manager.addConstructor(Vendor);

// class VendorDB {
//     public _id: number;
//     public _fk_vendor2DB_vendor2: number;

//     constructor(_id: number, _fk_vendor2DB_vendor2: number) {
//         this._id = _id;
//         this._fk_vendor2DB_vendor2 = _fk_vendor2DB_vendor2;
//     }
// }
// Manager.addConstructor(VendorDB);

// class Vendor2 {
//     public _id: number;
//     public name: string;

//     constructor(_id: number, name: string) {
//         this._id = _id;
//         this.name = name;
//     }
// }
// Manager.addConstructor(Vendor2);

// // Because we indicated that there needs to be two arguments
// // to create a new FoodTruck, TypeScript will provide errors
// // when you only use one:

// const vendor2 = new Vendor2(1, 'noob');

// const vendor = new Vendor(0, 'a', vendor2);
// const vendorDB = new VendorDB(0, 'a', vendor2._id);

// console.log('vendor', vendor);
// console.log('vendorDB', vendorDB);
// console.log('value', Manager.generateDB(vendor));