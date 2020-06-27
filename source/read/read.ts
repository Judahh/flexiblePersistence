import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
import { PersistenceInput } from '../persistenceAdapter/persistenceInput';
export class Read {
  private readDB: PersistenceAdapter;

  constructor(readDB: PersistenceAdapter) {
    this.readDB = readDB;
  }

  public newEvent(event: Event): Promise<PersistencePromise> {
    Operation.create.valueOf();
    return new Promise<PersistencePromise>((resolve, reject) => {
      const input: PersistenceInput = {
        single: event.isSingle(),
        scheme: event.getName(),
        id: event.getSelection() ? event.getSelection().id : undefined,
        selectedItem: event.getSelection(),
        item: event.getContent(),
      };
      this.readDB[Operation[event.getOperation()]](input)
        .then(resolve)
        .catch(reject);
    });
  }

  public getReadDB(): PersistenceAdapter {
    return this.readDB;
  }
}
