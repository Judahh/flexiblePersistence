/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEvent } from './iEvent';
import { DirectedEvent } from './directedEvent';
import { Operation } from './operation';
export class Event extends DirectedEvent {
  protected operation: Operation;
  protected name!: string;
  protected getConstructorName(object) {
    let name = object.constructor.name;
    if (name.includes('_')) name = name.split('_')[1];
    return name;
  }
  constructor(event: IEvent) {
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
