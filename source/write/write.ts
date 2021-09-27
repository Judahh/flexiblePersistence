import { Event } from '../event/event';
import { Read } from '../read/read';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/read/iInputRead';
import { Operation } from '..';
import { mongo } from 'mongoose';
import IOptions from '../handler/iOptions';
export class Write {
  protected _read?: Read;
  protected _eventDB: IPersistence;

  protected options?: IOptions;

  constructor(event: IPersistence, read?: Read, options?: IOptions) {
    this.options = options;
    this._eventDB = event;
    this._read = read;
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
    const operation = event['operation'];
    if (operation === Operation.create || operation === Operation.existent) {
      this.addIds(event);
    }

    return new Promise<IOutput<unknown, unknown>>(async (resolve, reject) => {
      const promises: Array<Promise<IOutput<unknown, unknown>>> = [];
      const operation = event.getOperation().toString();
      if (!(this.options?.drop && this.options?.drop[operation])) {
        promises.push(this._eventDB.create({ scheme: 'events', item: event }));
      }
      if (this._read) promises.push(this._read.newEvent(event));
      if (this.options?.isInSeries) {
        for (let index = 0; index < promises.length; index++) {
          const promise = promises[index];
          Promise.resolve(promise)
            .then((value) =>
              index === promises.length - 1 ? resolve(value) : undefined
            )
            .catch(reject);
        }
      } else {
        Promise.all(promises)
          .then((value) => resolve(value[value.length - 1]))
          .catch(reject);
      }
    });
  }

  read(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    return this._eventDB.read(input);
  }

  clear(): Promise<IOutput<unknown, unknown>> {
    return this._eventDB.delete({ scheme: 'events', single: false });
  }
}
