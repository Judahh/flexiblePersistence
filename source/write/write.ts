/* eslint-disable @typescript-eslint/no-explicit-any */

import { Event } from '../event/event';
import { Read } from '../read/read';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/input/persistenceInputRead';
import { Operation } from '..';
export class Write {
  private _read?: Read;
  private _eventDB: PersistenceAdapter;

  constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
    this._eventDB = event;
    if (read) {
      this._read = new Read(read);
    }
  }

  public getRead(): Read | undefined {
    return this._read;
  }

  public addEvent(event: Event): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      if (Array.isArray(event.getContent()))
        this._eventDB
          .create({ scheme: 'events', item: event })
          .then((persistencePromise: PersistencePromise) => {
            event['_id'] = persistencePromise.receivedItem._id
              ? persistencePromise.receivedItem._id
              : persistencePromise.receivedItem[0]._id;

            event['__v'] = persistencePromise.receivedItem.__v
              ? persistencePromise.receivedItem.__v
              : persistencePromise.receivedItem[0].__v;

            if (
              event.getOperation() === Operation.create ||
              event.getOperation() === Operation.existent
            )
              event.setReceivedContent(persistencePromise.receivedItem);

            if (this._read) {
              this._read.newEvent(event).then(resolve).catch(reject);
            } else {
              resolve(persistencePromise);
            }
          })
          .catch(reject);
      else
        this._eventDB
          .create({ scheme: 'events', item: event })
          .then((persistencePromise: PersistencePromise) => {
            event['_id'] = persistencePromise.receivedItem._id;
            event['__v'] = persistencePromise.receivedItem.__v;
            if (
              event.getOperation() === Operation.create ||
              event.getOperation() === Operation.existent
            )
              event.setReceivedContent(persistencePromise.receivedItem);
            if (this._read) {
              this._read.newEvent(event).then(resolve).catch(reject);
            } else {
              resolve(persistencePromise);
            }
          })
          .catch(reject);
    });
  }

  public read(input: PersistenceInputRead): Promise<PersistencePromise> {
    return this._eventDB.read(input);
  }

  public clear(scheme: string): Promise<PersistencePromise> {
    return this._eventDB.delete({ scheme, single: false });
  }
}
