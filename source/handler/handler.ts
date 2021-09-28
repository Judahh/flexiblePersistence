/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/read/iInputRead';
import IOptions from './iOptions';
import { Operation } from '../event/operation';
import { mongo } from 'mongoose';
export class Handler {
  protected read?: Read;
  protected write?: Write;
  protected options?: IOptions;

  constructor(event?: IPersistence, read?: IPersistence, options?: IOptions) {
    this.options = options;

    if (read) {
      this.read = new Read(read);
    }

    if (event) {
      this.write = new Write(event, this.read, this.options);
    }

    if (!this.read && !this.write) {
      throw new Error('Handler must have a ReadDB or a WriteDB.');
    }
  }

  getWrite(): Write | undefined {
    return this.write;
  }

  protected doRead(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    if (!this.read && !this.write) {
      throw new Error('Handler must have a ReadDB.');
    }
    return this.read
      ? this.read.getReadDB().read(input)
      : this.write!.read(input);
  }

  protected addIds(objects: Event): void {
    if (Array.isArray(objects)) {
      for (const object of objects) {
        this.addId(object);
      }
    }
    this.addId(objects);
  }

  protected addId(object: Event): void {
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

  protected restoreEvent(event: Event): Event {
    if (!(event instanceof Event)) event = new Event(event);
    if (!event['id']) event.setId(new mongo.ObjectId());
    const operation = event['operation'];
    if (operation === Operation.create || operation === Operation.existent) {
      this.addIds(event);
    }
    return event;
  }

  addEvent(event: Event): Promise<IOutput<unknown, unknown>> {
    event = this.restoreEvent(event);
    if (!this.write) {
      if (this.read) return this.read.newEvent(event);
      throw new Error('Handler must have a WriteDB or ReadDB.');
    }
    return this.write.addEvent(event);
  }

  readArray(
    scheme: string,
    selectedItem?: unknown
  ): Promise<IOutput<unknown, unknown>> {
    return this.doRead({ scheme, selectedItem, single: false });
  }

  readItem(
    scheme: string,
    selectedItem?: unknown
  ): Promise<IOutput<unknown, unknown>> {
    return this.doRead({ scheme, selectedItem, single: true });
  }

  readItemById(
    scheme: string,
    id: unknown
  ): Promise<IOutput<unknown, unknown>> {
    return this.doRead({ scheme, id });
  }

  getRead(): Read | undefined {
    return this.read;
  }

  migrate(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.read || !this.write) {
          throw new Error('Handler must have a ReadDB or a WriteDB.');
        } else {
          const events = (await this.getWrite()!.read({
            scheme: 'events',
            single: false,
          })) as IOutput<unknown, Event[]>;
          await this.getRead()!.clear();
          await this.getWrite()!.clear();
          const rEvents: IOutput<unknown, unknown>[] = [];
          if (events.receivedItem)
            for (const event of events.receivedItem) {
              rEvents.push(await this.addEvent(event));
            }
        }
      } catch (error) {
        console.error(error);

        reject(error);
      }
      resolve(true);
    });
  }
}
