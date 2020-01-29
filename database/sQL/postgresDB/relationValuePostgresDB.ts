import { RelationValueAdapter } from '../../../model/relationValueAdapter';

export class RelationValuePostgresDB extends RelationValueAdapter {
    protected map = {
        0: { value: '=' },
        1: { value: '!=' },
        2: { value: 'LIKE' },
        3: { value: '~' },
        4: { value: '>' },
        5: { value: '>=' },
        6: { value: '<' },
        7: { value: '<=' }
    };
}
