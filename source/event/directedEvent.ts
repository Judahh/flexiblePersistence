import { BasicDirectedEvent } from './basicDirectedEvent';

/* eslint-disable @typescript-eslint/no-explicit-any */
export class DirectedEvent {
  protected id: unknown;
  protected timestamp: string;
  protected content:
    | BasicDirectedEvent
    | BasicDirectedEvent[]
    | unknown
    | unknown[];
  protected selection: unknown;
  protected single: boolean;

  constructor(event: BasicDirectedEvent) {
    this.timestamp = event.timestamp || this.currentTimestamp();
    this.content = event.content;
    this.selection = event.selection;
    this.single = event.single === undefined ? true : event.single;
    this.id = event.id;
  }

  //  deepcode ignore no-any: any needed
  setContent(content?: BasicDirectedEvent | BasicDirectedEvent[]): void {
    this.content = content;
  }

  getTimestamp(): string {
    return this.timestamp;
  }

  //  deepcode ignore no-any: any needed
  getContent(): BasicDirectedEvent | BasicDirectedEvent[] | any | any[] {
    return this.content;
  }

  getSelection(): unknown {
    return this.selection;
  }

  isSingle(): boolean {
    return this.single;
  }

  getId(): unknown {
    return this.id;
  }

  setId(id: unknown): void {
    this.id = id;
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
