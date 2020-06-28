import ServiceModel from '../model/serviceModel';
import ServiceSelectByIdAdapter from '../adapter/service/serviceSelectByIdAdapter';
import BaseServiceDefault from './baseServiceDefault';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default class BaseServiceSelectById extends BaseServiceDefault
  implements ServiceSelectByIdAdapter {
  // @ts-ignore
  protected abstract async selectElementById(id: string): Promise<ServiceModel>;

  public async selectById(id: string): Promise<ServiceModel> {
    const result = await this.selectElementById(id);
    return result;
  }
}
