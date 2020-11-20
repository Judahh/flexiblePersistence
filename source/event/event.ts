/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operation } from './operation';
export class Event {
  private _id: unknown;
  private __v: unknown;
  private timestamp: string;
  private operation: Operation;
  private name: string;
  private content: unknown | unknown[];
  private receivedContent: unknown | unknown[];
  private selection: unknown;
  private single: boolean;

  constructor(event: {
    operation: Operation;
    name?: string;
    selection?: unknown;
    single?: boolean;
    //  deepcode ignore no-any: any needed
    content?: any | any[];
    receivedContent?: any | any[];
    timestamp?: string;
    _id?: unknown;
    __v?: unknown;
  }) {
    this.timestamp = event.timestamp || this.currentTimestamp();
    this.operation = event.operation;
    const tempName =
      event && event.content
        ? Array.isArray(event.content)
          ? event.content[0]
            ? event.content[0].constructor.name
            : undefined
          : event.content.constructor.name
        : undefined;
    this.name = event.name || tempName;
    this.content = event.content;
    this.receivedContent = event.receivedContent;
    this.selection = event.selection;
    this.single = event.single === undefined ? true : event.single;
    this.__v = event.__v;
    this._id = event._id;
  }

  public setReceivedContent(receivedContent?: any | any[]): void {
    this.receivedContent = receivedContent;
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

  public getContent(): unknown | unknown[] {
    return this.content;
  }

  public getReceivedContent(): unknown | unknown[] {
    return this.receivedContent;
  }

  public getSelection(): unknown {
    return this.selection;
  }

  public isSingle(): boolean {
    return this.single;
  }

  public getId(): unknown {
    return this._id;
  }

  public getV(): unknown {
    return this.__v;
  }

  private currentTimestamp(): string {
    const date = new Date();
    const dash = '-';
    const colon = ':';
    const dot = '.';
    return (
      date.getFullYear() +
      dash +
      this.pad(date.getMonth() + 1) +
      dash +
      this.pad(date.getDate()) +
      ' ' +
      this.pad(date.getHours()) +
      colon +
      this.pad(date.getMinutes()) +
      colon +
      this.pad(date.getSeconds()) +
      dot +
      this.pad(date.getMilliseconds())
    );
  }

  private pad(n: number): string | number {
    return n < 10 ? '0' + n : n;
  }
}
