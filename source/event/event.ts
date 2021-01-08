/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicEvent } from './basicEvent';
import { DirectedEvent } from './directedEvent';
import { Operation } from './operation';
export class Event extends DirectedEvent {
  protected operation: Operation;
  protected name!: string;
  private getConstructorName(object) {
    let name = object.constructor.name;
    if (name.includes('_')) name = name.split('_')[1];
    return name;
  }
  constructor(event: BasicEvent) {
    super(event);
    this.operation = event.operation;
    const tempName =
      event && event.content
        ? Array.isArray(event.content)
          ? event.content[0]
            ? this.getConstructorName(event.content[0])
            : undefined
          : this.getConstructorName(event.content)
        : undefined;
    if (tempName) this.name = tempName;
    if (event.name) this.name = event.name;
  }

  getOperation(): Operation {
    return this.operation;
  }

  getName(): string {
    return this.name;
  }
}
