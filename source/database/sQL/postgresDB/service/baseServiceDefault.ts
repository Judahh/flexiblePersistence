import { settings } from 'ts-mixer';
import { Handler } from 'flexiblepersistence';
import Default from '../default/default';
import BaseServiceDefaultInitializer from './baseServiceDefaultInitializer';
settings.initFunction = 'init';
/* eslint-disable @typescript-eslint/ban-ts-ignore */
export default class BaseServiceDefault extends Default {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  protected handler: Handler;
  protected baseClass = 'BaseService';

  protected nameDAO: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async dAO(method: string, ...args: any): Promise<any[]> {
    if (!this.nameDAO) this.nameDAO = this.element.replace('Service', 'DAO');
    return this.journaly.publish(this.nameDAO + '.' + method, ...args);
  }

  protected constructor(initDefault: BaseServiceDefaultInitializer) {
    super(initDefault);
    this.handler = initDefault.handler;
  }

  protected init(initDefault: BaseServiceDefaultInitializer): void {
    super.init(initDefault);
    this.handler = initDefault.handler;
  }
}
