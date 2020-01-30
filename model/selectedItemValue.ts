import { RelationValueAdapter } from './relationValueAdapter';
import { PersistenceFunction } from './persistenceFunction';
export class SelectedItemValue {
    relation: RelationValueAdapter;
    value: number | string | PersistenceFunction;

    constructor(value: number | string | PersistenceFunction, relation: RelationValueAdapter) {
        this.value = value;
        this.relation = relation;
    }

    public toString() {
        return this.value === undefined ?
            undefined :
            `${this.relation.toString()} ${'\'' + this.value.toString() + '\''}`
    }
}
