import { Operation } from './operation';
export declare class Event {
    private _id;
    private __v;
    private timestamp;
    private operation;
    private name;
    private content;
    private selection;
    private single;
    constructor(event: {
        operation: Operation;
        name?: string;
        selection?: any;
        single?: boolean;
        content?: any;
        timestamp?: string;
        _id?: any;
        __v?: any;
    });
    getOperation(): Operation;
    getTimestamp(): string;
    getName(): string;
    getContent(): any;
    getSelection(): any;
    isSingle(): boolean;
    getId(): any;
    getV(): any;
    private currentTimestamp;
    private pad;
}
//# sourceMappingURL=event.d.ts.map