import { RelationValueAdapter } from './relationValueAdapter';
import { PersistenceFunction } from './persistenceFunction';
export declare class SelectedItemValue {
    relation: RelationValueAdapter;
    value: number | string | PersistenceFunction;
    constructor(value: number | string | PersistenceFunction, relation: RelationValueAdapter);
    toString(): string | undefined;
}
//# sourceMappingURL=selectedItemValue.d.ts.map