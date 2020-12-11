/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/input/read/persistenceInputRead';
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
    selectedItem: any
  ): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, selectedItem, single: false });
  }

  readItem(
    scheme: string,
    selectedItem: any
  ): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, selectedItem, single: true });
  }

  readItemById(scheme: string, id): Promise<PersistencePromise<any>> {
    return this.doRead({ scheme, id });
  }
}
