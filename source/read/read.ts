/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { PersistenceAdapter } from '../iPersistence/iPersistence';
import { PersistencePromise } from '../iPersistence/output/persistencePromise';
import { PersistenceInput } from '../iPersistence/input/iInput';
export class Read {
  private readDB: PersistenceAdapter;

  constructor(readDB: PersistenceAdapter) {
    this.readDB = readDB;
  }
  //  deepcode ignore no-any: any needed
  newEvent(event: Event): Promise<PersistencePromise<any>> {
    Operation.create.valueOf();
    const id = event.getSelection()
      ? //  deepcode ignore no-any: any needed
        (event.getSelection() as any).id
      : event.isSingle() &&
        (event.getOperation() == Operation.create ||
          event.getOperation() == Operation.existent)
      ? event.getId()
      : undefined;
    //  deepcode ignore no-any: any needed
    const input: PersistenceInput<any> = {
      single: event.isSingle(),
      scheme: event.getName(),
      id: id ? String(id) : undefined,
      selectedItem: event.getSelection(),
      item: event.getContent(),
      eventOptions: event.getOptions(),
    };
    return this.readDB[Operation[event.getOperation()]](input);
  }

  getReadDB(): PersistenceAdapter {
    return this.readDB;
  }
}
