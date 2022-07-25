/* eslint-disable no-unused-vars */
import { Event } from '../event/event';
import { Read } from '../read/read';
import { IPersistence } from '../iPersistence/iPersistence';
import { IOutput } from '../iPersistence/output/iOutput';
import { IInputRead } from '../iPersistence/input/read/iInputRead';
import { Operation } from '..';
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

  getPersistence(): IPersistence {
    return this._eventDB;
  }

  getRead(): Read | undefined {
    return this._read;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async resolvePromises(
    promises: Array<Promise<IOutput<unknown, unknown>>>,
    resolve: (
      value: IOutput<unknown, unknown> | PromiseLike<IOutput<unknown, unknown>>
    ) => void,
    reject: (reason?: unknown) => void
  ) {
    if (this.options?.isInSeries) {
      for (let index = 0; index < promises.length; index++) {
        const promise = promises[index];
        await Promise.resolve(promise)
          .then((value) =>
            index === promises.length - 1 ? resolve(value) : undefined
          )
          .catch(reject);
      }
    } else {
      await Promise.all(promises)
        .then((value) => resolve(value[value.length - 1]))
        .catch(reject);
    }
  }

  addEvent(event: Event): Promise<IOutput<unknown, unknown>> {
    return new Promise<IOutput<unknown, unknown>>(
      async (
        resolve: (
          value:
            | IOutput<unknown, unknown>
            | PromiseLike<IOutput<unknown, unknown>>
        ) => void,
        reject: (reason?: unknown) => void
      ) => {
        const promises: Array<Promise<IOutput<unknown, unknown>>> = [];
        const operation = Operation[event.getOperation()];
        if (!this.options?.drop?.[operation]) {
          // console.log('EVENT CREATE', operation, this._eventDB);
          promises.push(
            this._eventDB.create({
              scheme: 'events',
              item: event,
            })
          );
        }
        if (this._read) promises.push(this._read.newEvent(event));
        await this.resolvePromises(promises, resolve, reject);
      }
    );
  }

  read(input?: IInputRead): Promise<IOutput<unknown, unknown>> {
    // console.log('EVENT READ', this._eventDB);
    return this._eventDB.read(input ? input : { scheme: 'events' });
  }

  clear(): Promise<IOutput<unknown, unknown>> {
    return this._eventDB.delete({ scheme: 'events', single: false });
  }
}
