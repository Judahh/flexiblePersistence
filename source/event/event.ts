/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicEvent } from './basicEvent';
import { DirectedEvent } from './directedEvent';
import { Operation } from './operation';
export class Event extends DirectedEvent {
  protected operation: Operation;
  protected name!: string;
  private receivedContent?: BasicEvent | BasicEvent[];

  constructor(event: BasicEvent) {
    super(event);
    this.operation = event.operation;
    const tempName =
      event && event.content
        ? Array.isArray(event.content)
          ? event.content[0]
            ? event.content[0].constructor.name
            : undefined
          : event.content.constructor.name
        : undefined;
    if (tempName) this.name = tempName;
    if (event.name) this.name = event.name;
    this.receivedContent = event.receivedContent;
  }

  setReceivedContent(receivedContent?: BasicEvent | BasicEvent[]): void {
    this.receivedContent = receivedContent;
  }

  getOperation(): Operation {
    return this.operation;
  }

  getName(): string {
    return this.name;
  }

  getReceivedContent(): undefined | BasicEvent | BasicEvent[] {
    return this.receivedContent;
  }
}
