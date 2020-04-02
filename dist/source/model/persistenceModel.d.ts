import { BasicModel } from './basicModel';
import { VolatileModel } from './volatileModel';
export declare abstract class PersistenceModel extends BasicModel {
    private static volatileModel;
    static setVolatileModel(volatileModel: VolatileModel): void;
    static generateVolatile(object: any): any;
}
//# sourceMappingURL=persistenceModel.d.ts.map