import { RelationValueAdapter } from './relationValueAdapter';
import { PersistenceFunction } from './persistenceFunction';
export class SelectedItemValue {
    relation: RelationValueAdapter;
    value:  string | PersistenceFunction;

    public toString(){
        return `${this.relation.toString()} ${this.value.toString()}`
    }
}
