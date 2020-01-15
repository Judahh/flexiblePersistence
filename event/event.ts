import { Operation } from './operation';
export class Event {
    private _id: any;
    private __v: any;
    private timestamp: string;
    private operation: Operation;
    private name: string;
    private content: any;
    private selection: any;

    constructor({ operation, name, selection, content }: { operation: Operation; name?: string; selection?: any; content?: any; }) {
        this.timestamp = this.currentTimestamp();
        this.operation = operation;
        this.name = name || content.constructor.name;
        this.content = content;
        this.selection = selection;
    }

    public getOperation() {
        return this.operation;
    }

    public getTimestamp() {
        return this.timestamp;
    }

    public getName() {
        return this.name;
    }

    public getContent() {
        return this.content;
    }

    public getSelection() {
        return this.selection;
    }

    public getId() {
        return this._id;
    }

    public getV() {
        return this.__v;
    }

    private currentTimestamp() {
        let date = new Date();
        let dash = '-';
        let colon = ':';
        let dot = '.';
        return date.getFullYear() + dash +
            this.pad(date.getMonth() + 1) + dash +
            this.pad(date.getDate()) + ' ' +
            this.pad(date.getHours()) + colon +
            this.pad(date.getMinutes()) + colon +
            this.pad(date.getSeconds()) + dot +
            this.pad(date.getMilliseconds());
    }

    private pad(n) {
        return n < 10 ? '0' + n : n
    }
}
