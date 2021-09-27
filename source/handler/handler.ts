/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/read/iInputRead';
export class Handler {
  protected read?: Read;
  protected write: Write;

  constructor(event: IPersistence, read?: IPersistence) {
    this.write = new Write(event, read);
    if (read) {
      this.read = this.write.getRead();
    }
  }

  getWrite(): Write {
    return this.write;
  }

  protected doRead(input: IInputRead): Promise<IOutput<unknown, unknown>> {
    return this.read
      ? this.read.getReadDB().read(input)
      : this.write.read(input);
  }

  addEvent(event: Event): Promise<IOutput<unknown, unknown>> {
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

  readItemById(scheme: string, id): Promise<IOutput<unknown, unknown>> {
    return this.doRead({ scheme, id });
  }

  getReadDB(): IPersistence {
    const write = this.getWrite();
    if (write) {
      const read = write.getRead();
      if (read) if (read.getReadDB()) return read.getReadDB();
    }
    throw new Error('DatabaseHandler must have a ReadDB.');
  }

  migrate(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const events = (await this.getWrite().read({
          scheme: 'events',
          single: false,
        })) as IOutput<unknown, Event[]>;
        await this.getReadDB().clear();
        await this.getWrite().clear();
        const rEvents: IOutput<unknown, unknown>[] = [];
        if (events.receivedItem)
          for (const event of events.receivedItem) {
            rEvents.push(await this.addEvent(event));
          }
      } catch (error) {
        console.error(error);

        reject(error);
      }
      resolve(true);
    });
  }
}
