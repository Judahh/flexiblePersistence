import { Relation } from './relation';

export abstract class RelationValueAdapter {
    protected map: { [key: number]: { value: string } } = {
        0: { value: '=' },
        1: { value: '!=' },
        2: { value: 'LIKE' },
        3: { value: 'SIMILAR' },
        4: { value: '>' },
        5: { value: '>=' },
        6: { value: '<' },
        7: { value: '<=' }
    };

    protected relation: Relation;
    constructor(relation: Relation) {
        this.relation = relation;
    }

    public toString() {
        return this.map[this.relation];
    }
}
