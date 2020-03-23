import { Relation } from './relation';

export abstract class RelationValueAdapter {
  protected map: { [key: number]: string } = {
    0: '=',
    1: '!=',
    2: 'LIKE',
    3: 'SIMILAR',
    4: '>',
    5: '>=',
    6: '<',
    7: '<=',
  };

  protected relation: Relation;
  constructor(relation?: Relation) {
    if (!relation) {
      relation = Relation.Equal;
    }
    this.relation = relation;
  }

  public toString(): string {
    return this.map[this.relation];
  }
}
