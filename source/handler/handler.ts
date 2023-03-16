/* eslint-disable @typescript-eslint/no-explicit-any */
// file deepcode ignore no-any: any needed
import { Write } from '../write/write';
import { Read } from './../read/read';
import { Event } from '../event/event';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/iInputRead';
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

  protected async doRead(
    input: IInputRead
  ): Promise<IOutput<unknown, unknown, unknown> | undefined> {
    if (!this.read && !this.write) {
      throw new Error('Handler must have a ReadDB.');
    }
    return this.read
      ? this.read.getReadDB().read(input)
      : this.write?.read(input);
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
      if (
        object.id === undefined &&
        object._id === undefined &&
        !JSON.parse(process.env.DISABLE_AUTO_ID || 'false')
      )
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
    if (!event['id'] && !JSON.parse(process.env.DISABLE_AUTO_ID || 'false'))
      event.setId(new mongo.ObjectId());
    const operation = event['operation'];
    if (operation === Operation.create) this.addIds(event);
    return event;
  }

  addEvent(event: Event): Promise<IOutput<unknown, unknown, unknown>> {
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
  ): Promise<IOutput<unknown, unknown, unknown> | undefined> {
    return this.doRead({ scheme, selectedItem, single: false });
  }

  readItem(
    scheme: string,
    selectedItem?: unknown
  ): Promise<IOutput<unknown, unknown, unknown> | undefined> {
    return this.doRead({ scheme, selectedItem, single: true });
  }

  readItemById(
    scheme: string,
    id: unknown
  ): Promise<IOutput<unknown, unknown, unknown> | undefined> {
    return this.doRead({ scheme, id });
  }

  getRead(): Read | undefined {
    return this.read;
  }

  async backup(
    database?: IPersistence,
    scheme = 'events',
    pageSize = 50
  ): Promise<boolean> {
    try {
      if (database) {
        const newDatabase = (
          'bak(' +
          new Date().toISOString() +
          '):' +
          database.getPersistenceInfo().database
        )
          .replaceAll(':', '_')
          .replaceAll('.', '_');
        const newUri = (database.getPersistenceInfo() as any)?.uri?.replace(
          database.getPersistenceInfo().database,
          newDatabase
        );
        const backupInfo = {
          ...database.getPersistenceInfo(),
          database: newDatabase,
          uri: newUri,
        };
        const backupClass = database.constructor;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const backup: IPersistence = new backupClass(backupInfo);
        const eventOptions: {
          pageSize: number;
          page?: number;
          pages?: number;
        } = {
          pageSize: pageSize,
          page: 0,
        };
        let total = pageSize;
        while (
          total > 0 &&
          (eventOptions.pages === undefined ||
            (eventOptions.pages !== undefined &&
              eventOptions.page !== undefined &&
              eventOptions.page < eventOptions.pages))
        ) {
          const read = await database.read({ scheme: scheme, eventOptions });
          total = read.receivedItem.length;
          await backup.create({
            single: false,
            item: read.receivedItem,
            scheme: scheme,
          });
          if (eventOptions.page !== undefined) eventOptions.page++;
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  migrate(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const ignoreError =
        JSON.parse(process.env.MIGRATION_IGNORE_ERROR || 'false') || false;
      const disableBackup =
        JSON.parse(process.env.MIGRATION_DISABLE_BACKUP || 'false') || false;
      const pageSize =
        JSON.parse(process.env.MIGRATION_PAGE_SIZE || '50') || 50;
      try {
        if (!this.read || !this.write) {
          throw new Error('Handler must have a ReadDB or a WriteDB.');
        } else {
          if (!disableBackup) {
            console.log('Starting Backup');

            const backupResult = await this.backup(
              this?.getWrite()?.getPersistence(),
              'events',
              pageSize
            );
            if (!backupResult) throw new Error('BACKUP ERROR.');
            console.log('Backup Complete');
          }
          const events = (await this.getWrite()?.read({
            scheme: 'events',
            single: false,
          })) as IOutput<unknown, unknown, Event[]>;
          await this.getRead()?.clear();
          await this.getWrite()?.clear();
          const rEvents: IOutput<unknown, unknown, unknown>[] = [];
          if (events.receivedItem)
            for (const event of events.receivedItem) {
              try {
                rEvents.push(await this.addEvent(event));
              } catch (error) {
                console.error(error);
                if (!ignoreError) reject(error);
              }
            }
        }
      } catch (error) {
        console.error(error);
        if (!ignoreError) reject(error);
      }
      console.log('DONE MIGRATION');
      resolve(true);
    });
  }
}
