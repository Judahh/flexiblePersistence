/* eslint-disable @typescript-eslint/no-explicit-any */
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { PersistenceAdapter } from '../persistenceAdapter/persistenceAdapter';
import { PersistencePromise } from '../persistenceAdapter/output/persistencePromise';
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

  public addEvent(event: Event): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      this.write.addEvent(event).then(resolve).catch(reject);
    });
  }

  public readArray(
    scheme: string,
    selectedItem: any
  ): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      if (this.read) {
        this.read
          .getReadDB()
          .read({ scheme, selectedItem, single: false })
          .then(resolve)
          .catch(reject);
      } else {
        this.write
          .read({ scheme, selectedItem, single: false })
          .then(resolve)
          .catch(reject);
      }
    });
  }

  public readItem(
    scheme: string,
    selectedItem: any
  ): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      if (this.read) {
        this.read
          .getReadDB()
          .read({ scheme, selectedItem, single: true })
          .then(resolve)
          .catch(reject);
      } else {
        this.write
          .read({ scheme, selectedItem, single: true })
          .then(resolve)
          .catch(reject);
      }
    });
  }

  public readItemById(scheme: string, id): Promise<PersistencePromise> {
    return new Promise<PersistencePromise>((resolve, reject) => {
      if (this.read) {
        this.read.getReadDB().read({ scheme, id }).then(resolve).catch(reject);
      } else {
        this.write.read({ scheme, id }).then(resolve).catch(reject);
      }
    });
  }
}
