/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInput } from '../iPersistence/input/iInput';
export class Read {
  private readDB: IPersistence;

  constructor(readDB: IPersistence) {
    this.readDB = readDB;
  }
  //  deepcode ignore no-any: any needed
  newEvent(event: Event): Promise<IOutput<unknown, unknown>> {
    Operation.create.valueOf();
    const id = event.getSelection()
      ? (event.getSelection() as any).id
      : event.isSingle() &&
        (event.getOperation() == Operation.create ||
          event.getOperation() == Operation.existent)
      ? event.getId()
      : undefined;
    const input: IInput<unknown> = {
      single: event.isSingle(),
      scheme: event.getName(),
      id: id ? String(id) : undefined,
      selectedItem: event.getSelection(),
      item: event.getContent(),
      eventOptions: event.getOptions(),
    };
    return this.readDB[Operation[event.getOperation()]](input);
  }

  getReadDB(): IPersistence {
    return this.readDB;
  }
}
