/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation } from './operation';
export class Event {
    private _id: any;
    private __v: any;
    private timestamp: string;
    private operation: Operation;
    private name: string;
    private content: any;
    private selection: any;

    constructor(event: {
        operation: Operation;
        name?: string;
        selection?: any;
        content?: any ;
        timestamp?: string;
        _id?: any;
        __v?: any;
    }) {
        this.timestamp = event.timestamp || this.currentTimestamp();
        this.operation = event.operation;
        this.name = event.name || event ? ( event.content ? (event.content.constructor ? event.content.constructor.name : 'any') : 'any') : 'any';
        this.content = event.content;
        this.selection = event.selection;
        this.__v = event.__v;
        this._id = event._id;
    }

    public getOperation(): Operation {
        return this.operation;
    }

    public getTimestamp(): string {
        return this.timestamp;
    }

    public getName(): string {
        return this.name;
    }

    public getContent(): any{
        return this.content;
    }

    public getSelection(): any {
        return this.selection;
    }

    public getId(): any {
        return this._id;
    }

    public getV(): any {
        return this.__v;
    }

    private currentTimestamp(): string {
        const date = new Date();
        const dash = '-';
        const colon = ':';
        const dot = '.';
        return date.getFullYear() + dash +
            this.pad(date.getMonth() + 1) + dash +
            this.pad(date.getDate()) + ' ' +
            this.pad(date.getHours()) + colon +
            this.pad(date.getMinutes()) + colon +
            this.pad(date.getSeconds()) + dot +
            this.pad(date.getMilliseconds());
    }

    private pad(n: number): string | number {
        return n < 10 ? '0' + n : n
    }
}
