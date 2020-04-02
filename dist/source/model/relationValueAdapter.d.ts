import { Relation } from './relation';
export declare abstract class RelationValueAdapter {
    protected map: {
        [key: number]: string;
    };
    protected relation: Relation;
    constructor(relation?: Relation);
    toString(): string;
}
//# sourceMappingURL=relationValueAdapter.d.ts.map