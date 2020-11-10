/* eslint-disable @typescript-eslint/no-explicit-any */
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
import { PersistenceInputRead } from '../persistenceAdapter/input/persistenceInputRead';
export class Handler {
  private read?: Read;
  private write: Write;

  constructor(event: PersistenceAdapter, read?: PersistenceAdapter) {
    this.write = new Write(event, read);
    if (read) {
      this.read = this.write.getRead();
    }
  }

  public getWrite(): Write {
    return this.write;
  }

  private doRead(input: PersistenceInputRead): Promise<PersistencePromise> {
    return this.read
      ? this.read.getReadDB().read(input)
      : this.write.read(input);
  }

  public addEvent(event: Event): Promise<PersistencePromise> {
    return this.write.addEvent(event);
  }

  public readArray(
    scheme: string,
    selectedItem: any
  ): Promise<PersistencePromise> {
    return this.doRead({ scheme, selectedItem, single: false });
  }

  public readItem(
    scheme: string,
    selectedItem: any
  ): Promise<PersistencePromise> {
    return this.doRead({ scheme, selectedItem, single: true });
  }

  public readItemById(scheme: string, id): Promise<PersistencePromise> {
    return this.doRead({ scheme, id });
  }
}
