/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/iPersistence';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/input/read/iInputRead';
export class Handler {
  private read?: Read;
  private write: Write;

  constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
    this.write = new Write(event, read);
    if (read) {
      this.read = this.write.getRead();
    }
  }

  getWrite(): Write {
    return this.write;
  }

  private doRead(
    input: PersistenceInputRead
  ): Promise<PersistencePromise<any>> {
    return this.read
      ? this.read.getReadDB().read(input)
      : this.write.read(input);
  }

  addEvent(event: Event): Promise<PersistencePromise<any>> {
    return this.write.addEvent(event);
  }

  readArray(
    scheme: string,
    selectedItem?: any
  ): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, selectedItem, single: false });
  }

  readItem(
    scheme: string,
    selectedItem?: any
  ): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, selectedItem, single: true });
  }

  readItemById(scheme: string, id): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, id });
  }

  getReadDB(): PersistenceAdapter {
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
        const events = await this.getWrite().read({
          scheme: 'events',
          single: false,
        });
        await this.getReadDB().clear();
        await this.getWrite().clear();
        const rEvents: any[] = [];
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
