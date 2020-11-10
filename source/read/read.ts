import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInput } from '../persistenceAdapter/input/persistenceInput';
export class Read {
  private readDB: PersistenceAdapter;

  constructor(readDB: PersistenceAdapter) {
    this.readDB = readDB;
  }

  public newEvent(event: Event): Promise<PersistencePromise> {
    Operation.create.valueOf();
    const id = event.getSelection()
      ? event.getSelection().id
      : event.isSingle() &&
        (event.getOperation() == Operation.create ||
          event.getOperation() == Operation.existent)
      ? event.getId()
      : undefined;
    const input: PersistenceInput = {
      single: event.isSingle(),
      scheme: event.getName(),
      id: id ? String(id) : undefined,
      selectedItem: event.getSelection(),
      item: event.getContent(),
    };
    return this.readDB[Operation[event.getOperation()]](input);
  }

  public getReadDB(): PersistenceAdapter {
    return this.readDB;
  }
}
