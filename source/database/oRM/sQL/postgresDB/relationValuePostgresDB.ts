import { RelationValueAdapter } from '../../../../model/relationValueAdapter';

export class RelationValuePostgresDB extends RelationValueAdapter {
  protected map = {
    0: '=',
    1: '!=',
    2: 'LIKE',
    3: '~',
    4: '>',
    5: '>=',
    6: '<',
    7: '<=',
  };
}
