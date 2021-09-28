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

  addEvent(event: Event): Promise<IOutput<unknown, unknown>> {
    if (!this.write) {
      throw new Error('Handler must have a WriteDB.');
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
