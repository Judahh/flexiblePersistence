import { Operation } from '..';
import { IDirectedEvent } from './iDirectedEvent';
import { IOptions } from './iOptions';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DirectedEvent {
  id: unknown;
  _id?: unknown;
  protected timestamp: string;
  content: IDirectedEvent | IDirectedEvent[] | unknown | unknown[];
  protected selection: unknown;
  protected options?: IOptions;
  protected single: boolean;
  protected correct: boolean;
  protected replace?: boolean; // only for create/update/other

  constructor(event: IDirectedEvent) {
    this.timestamp = event.timestamp || this.currentTimestamp();
    this.content = event.content;
    this.selection = event.selection;
    this.single = event.single === undefined ? true : event.single;
    this.id = event.id;
    this.options = event.options;
    this.correct =
      event.operation !== Operation.read ? event.correct || false : false;
    this.replace =
      event.operation === Operation.create ||
      event.operation === Operation.update ||
      event.operation === Operation.other
        ? event.replace || false
        : undefined;
  }

  //  deepcode ignore no-any: any needed
  setContent(content?: IDirectedEvent | IDirectedEvent[]): void {
    this.content = content;
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  //  deepcode ignore no-any: any needed
  getContent(): IDirectedEvent | IDirectedEvent[] | any | any[] {
    return this.content;
  }

  getSelection(): unknown {
    return this.selection;
  }

  getOptions(): unknown {
    return this.options;
  }

  isSingle(): boolean {
    return this.single;
  }

  isCorrect(): boolean {
    return this.correct;
  }

  isReplace(): boolean | undefined {
    return this.replace;
  }

  getId(): unknown {
    return this.id;
  }

  setId(id: unknown): void {
    this.id = id;
  }

  setOptions(options: IOptions): void {
    this.options = options;
  }

  protected currentTimestamp(): string {
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

  protected pad(n: number): string | number {
    return n < 10 ? '0' + n : n;
  }
}
