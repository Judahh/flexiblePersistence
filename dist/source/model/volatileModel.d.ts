import { BasicModel } from './basicModel';
import { PersistenceModel } from './persistenceModel';
export declare abstract class VolatileModel extends BasicModel {
    private static persistenceModel;
    static setPersistenceModel(persistenceModel: PersistenceModel): void;
    static generatePersistence(object: any): any;
}
//# sourceMappingURL=volatileModel.d.ts.map