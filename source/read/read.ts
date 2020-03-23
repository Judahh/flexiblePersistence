import { Event } from './../event/event';
import { Operation } from './../event/operation';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/persistencePromise';
export class Read {
  private readDB: PersistenceAdapter;

  constructor(readDB: PersistenceAdapter) {
    this.readDB = readDB;
  }

  public newEvent(event: Event): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      switch (event.getOperation()) {
        case Operation.add:
          this.readDB
            .addItem(event.getName(), event.getContent())
            .then(resolve)
            .catch(reject);
          break;

        case Operation.read:
          this.readDB
            .readArray(event.getName(), event.getSelection())
            .then(resolve)
            .catch(reject);
          break;

        case Operation.correct:
        case Operation.update:
          this.readDB
            .updateItem(
              event.getName(),
              event.getSelection(),
              event.getContent()
            )
            .then(resolve)
            .catch(reject);
          break;

        case Operation.delete:
        case Operation.nonexistent:
          this.readDB
            .deleteItem(event.getName(), event.getSelection())
            .then(resolve)
            .catch(reject);
          break;
        case Operation.clear:
          this.readDB
            .deleteArray(event.getName(), event.getSelection())
            .then(resolve)
            .catch(reject);
          break;
      }
    });
  }

  public getReadDB(): PersistenceAdapter {
    return this.readDB;
  }
}
