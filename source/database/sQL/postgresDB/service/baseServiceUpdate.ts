import ServiceUpdateAdapter from '../adapter/service/serviceUpdateAdapter';
import BaseServiceDefault from './baseServiceDefault';
import ServiceSimpleModel from '../model/serviceSimpleModel';
import ServiceModel from '../model/serviceModel';
import { Event, Operation } from 'flexiblepersistence';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default class BaseServiceUpdate extends BaseServiceDefault
  implements ServiceUpdateAdapter {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  protected abstract async updateElement(
    id: string,
    content: ServiceSimpleModel
  ): Promise<ServiceModel>;

  public async update(
    id: string,
    content: ServiceSimpleModel
  ): Promise<ServiceModel> {
    // Event Sourcing
    await this.handler.addEvent(
      new Event({
        operation: Operation.update,
        name: this.element,
        content,
        selection: { _id: id },
      })
    );

    const result = await this.updateElement(id, content);
    return result;
  }
}
