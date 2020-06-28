import ServiceModel from '../model/serviceModel';
import ServiceSelectAllAdapter from '../adapter/service/serviceSelectAllAdapter';
import BaseServiceDefault from './baseServiceDefault';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
export default class BaseServiceSelectAll extends BaseServiceDefault
  implements ServiceSelectAllAdapter {
  // @ts-ignore
  protected abstract async selectAllElements(): Promise<Array<ServiceModel>>;
  public async selectAll(): Promise<Array<ServiceModel>> {
    const result = await this.selectAllElements();
    return result;
  }
}
