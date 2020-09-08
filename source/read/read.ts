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
    return new Promise<PersistencePromise>((resolve, reject) => {
      const id = event.getSelection() ? event.getSelection().id :
            event.isSingle() && (event.getOperation() == Operation.create
            || event.getOperation() == Operation.existent) ? event.getId() :
            undefined
      const input: PersistenceInput = {
        single: event.isSingle(),
        scheme: event.getName(),
        id: id ? String(id) : undefined,
        selectedItem: event.getSelection(),
        item: event.getContent(),
      };
      // console.log('Operation: ', Operation[event.getOperation()]);
      // console.log('event: ', event);
      // console.log('input: ', input);
      this.readDB[Operation[event.getOperation()]](input)
        .then(resolve)
        .catch(reject);
    });
  }

  public getReadDB(): PersistenceAdapter {
    return this.readDB;
  }
}
