/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Event } from '../event/event';
import { Read } from '../read/read';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/input/read/persistenceInputRead';
import { Operation } from '..';
import { mongo } from 'mongoose';
export class Write {
  private _read?: Read;
  private _eventDB: PersistenceAdapter;

  constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
    this._eventDB = event;
    if (read) {
      this._read = new Read(read);
    }
  }

  getRead(): Read | undefined {
    return this._read;
  }

  addIds(objects) {
    if (Array.isArray(objects)) {
      for (const object of objects) {
        this.addId(object);
      }
    }
    this.addId(objects);
  }

  addId(object) {
    if (
      object !== null &&
      typeof object === 'object' &&
      !Array.isArray(object)
    ) {
      if (object.id === undefined && object._id === undefined)
        object.id = new mongo.ObjectId();
      for (const key in object) {
        if (
          Object.prototype.hasOwnProperty.call(object, key) &&
          key !== 'id' &&
          key !== '_id'
        ) {
          const element = object[key];
          this.addIds(element);
        }
      }
    }
  }

  addEvent(event: Event): Promise<PersistencePromise<any>> {
    event.setId(new mongo.ObjectId());
    if (
      event.getOperation() === Operation.create ||
      event.getOperation() === Operation.existent
    ) {
      this.addIds(event);
    }
    // console.log(event);

    return new Promise<PersistencePromise<any>>((resolve, reject) => {
      // console.log('event:', event);
      this._eventDB
        .create({ scheme: 'events', item: event })
        .then((persistencePromise: PersistencePromise<any>) => {
          // console.log('persistencePromise:', persistencePromise);

          if (
            event.getOperation() === Operation.create ||
            event.getOperation() === Operation.existent
          )
            event.setReceivedContent(persistencePromise.receivedItem);

          // console.log('new event:', event);

          if (this._read) {
            this._read.newEvent(event).then(resolve).catch(reject);
          } else {
            resolve(persistencePromise);
          }
        })
        .catch(reject);
    });
  }

  read(input: PersistenceInputRead): Promise<PersistencePromise<any>> {
    return this._eventDB.read(input);
  }

  clear(scheme: string): Promise<PersistencePromise<any>> {
    return this._eventDB.delete({ scheme, single: false });
  }
}
