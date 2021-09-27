import { Event } from '../event/event';
import { Read } from '../read/read';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/read/iInputRead';
import { Operation } from '..';
import { mongo } from 'mongoose';
export class Write {
  protected _read?: Read;
  protected _eventDB: IPersistence;

  constructor(event: IPersistence, read?: IPersistence) {
    this._eventDB = event;
    if (read) {
      this._read = new Read(read);
    }
  }

  getRead(): Read | undefined {
    return this._read;
  }

  addIds(objects: Event): void {
    if (Array.isArray(objects)) {
      for (const object of objects) {
        this.addId(object);
      }
    }
    this.addId(objects);
  }

  addId(object): void {
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

  addEvent(event: Event): Promise<IOutput<unknown, unknown>> {
    if (!(event instanceof Event)) event = new Event(event);
    if (!event['id']) event.setId(new mongo.ObjectId());
    // console.log(event.getId());
    const operation = event['operation'];
    if (operation === Operation.create || operation === Operation.existent) {
      this.addIds(event);
    }
    // console.log(event);

    return new Promise<IOutput<unknown, unknown>>((resolve, reject) => {
      const promises: Array<Promise<IOutput<unknown, unknown>>> = [];
      promises.push(this._eventDB.create({ scheme: 'events', item: event }));
      if (this._read) promises.push(this._read.newEvent(event));
      Promise.all(promises)
        .then((value) => resolve(value[value.length - 1]))
        .catch(reject);
    });
  }

  read(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    return this._eventDB.read(input);
  }

  clear(): Promise<IOutput<unknown, unknown>> {
    return this._eventDB.delete({ scheme: 'events', single: false });
  }
}
