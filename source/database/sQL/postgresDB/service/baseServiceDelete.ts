import ServiceDeleteAdapter from '../adapter/service/serviceDeleteAdapter';
import BaseServiceDefault from './baseServiceDefault';
import { Event, Operation } from 'flexiblepersistence';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default class BaseServiceDelete extends BaseServiceDefault
  implements ServiceDeleteAdapter {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  protected abstract async deleteElement(id: string): Promise<boolean>;
  public async delete(id: string): Promise<boolean> {
    // Event Sourcing
    await this.handler.addEvent(
      new Event({
        operation: Operation.delete,
        name: this.element,
        selection: { _id: id },
      })
    );
    const result = await this.deleteElement(id);
    return result;
  }
}
